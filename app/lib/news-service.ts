import { prisma } from '@/app/lib/prisma';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { fetchRSSFeed } from './rss-service';
import { RSS_FEEDS, type RSSFeedConfig } from './constants';
import { randomInt } from 'crypto';

export async function getLatestNews() {
  try {
    // Fetch the 5 most recently created news items from the database
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5, // Get the latest 5 rows (most recently created)
    });

    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

function cryptoShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function getRandomFeed(): Promise<RSSFeedConfig> {
  const microsecondEntropy = process.hrtime.bigint();
  const shuffledFeeds = cryptoShuffle([...RSS_FEEDS]);
  const primaryIndex = randomInt(0, shuffledFeeds.length);
  const entropyMod = Number(microsecondEntropy % BigInt(2));
  if (entropyMod === 0) {
    const reShuffled = cryptoShuffle(shuffledFeeds);
    const secondaryIndex = randomInt(0, reShuffled.length);
    return reShuffled[secondaryIndex];
  }
  
  return shuffledFeeds[primaryIndex];
}

async function rewriteTitleWithAI(originalTitle: string, source: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: `You are a professional tech news editor specializing in venture capital and startup funding news. 
      
Rewrite the following article title to make it more engaging, concise, and focused on the funding/investment angle if applicable. Keep it under 100 characters.

Original title: "${originalTitle}"
Source: ${source}

Provide only the rewritten title, nothing else.`,
      temperature: 0.7,
    });

    return text.trim();
  } catch (error) {
    console.error('Error rewriting title with AI:', error);
    return originalTitle;
  }
}

export async function processAndStoreRSSNews(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingNews = await prisma.news.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        source: true,
        url: true,
      },
    });

    const totalExistingArticles = existingNews.length;
    const existingUrls = new Set(existingNews.map(news => news.url));

    // Always try to fetch fresh articles, even if we already have some for today
    const MAX_TOTAL_ARTICLES = 5;
    const articlesNeeded = Math.max(0, MAX_TOTAL_ARTICLES - totalExistingArticles);

    let storedCount = 0;
    const sourceCount: Record<string, number> = {};
    const maxAttempts = 30;
    let attempts = 0;

    while (storedCount < articlesNeeded && attempts < maxAttempts) {
      attempts++;

      const randomDelay = randomInt(0, 11);
      await new Promise(resolve => setTimeout(resolve, randomDelay));

      const randomFeedConfig = await getRandomFeed();

      try {
        const articles = await fetchRSSFeed(randomFeedConfig, 5);

        if (articles.length === 0) {
          continue;
        }

        const shuffledArticles = cryptoShuffle(articles);

        let articleStored = false;
        for (const article of shuffledArticles) {
          if (existingUrls.has(article.url)) {
            continue;
          }

          const rewrittenTitle = await rewriteTitleWithAI(article.title, article.source);

          await prisma.news.create({
            data: {
              title: rewrittenTitle,
              url: article.url,
              imageUrl: article.imageUrl,
              source: article.source,
            },
          });

          existingUrls.add(article.url);
          storedCount++;
          sourceCount[article.source] = (sourceCount[article.source] || 0) + 1;

          articleStored = true;
          break;
        }

        if (!articleStored) {
          console.log(`All articles from ${randomFeedConfig.name} already exist, trying another feed...\n`);
        }

      } catch (error) {
        console.error(`Error processing ${randomFeedConfig.name}:`, error);
      }
    }

    if (Object.keys(sourceCount).length > 0) {
      Object.entries(sourceCount).forEach(([source, count]) => {
        console.log(`  - ${source}: ${count} article${count !== 1 ? 's' : ''}`);
      });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await prisma.news.deleteMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    return { success: true, count: storedCount };
  } catch (error) {
    console.error('Error processing RSS news:', error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
