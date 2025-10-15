import Parser from 'rss-parser';
import { RSS_FEEDS, type RSSFeedConfig } from './constants';

export type { RSSFeedConfig };

export interface ParsedArticle {
  title: string;
  url: string;
  imageUrl?: string;
  source: string;
  pubDate?: Date;
}

export async function fetchRSSFeed(feedConfig: RSSFeedConfig, limit: number = 5): Promise<ParsedArticle[]> {
  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'media:content'],
        ['media:thumbnail', 'media:thumbnail'],
        ['enclosure', 'enclosure'],
      ],
    },
  });

  try {
    const feed = await parser.parseURL(feedConfig.url);
    const articles: ParsedArticle[] = [];

    for (const item of feed.items.slice(0, limit)) {
      if (!item.title || !item.link) continue;

      let imageUrl: string | undefined;
      
      if (item['media:content'] && typeof item['media:content'] === 'object') {
        const mediaContent = item['media:content'] as { $?: { url?: string } };
        imageUrl = mediaContent.$ && mediaContent.$.url;
      }
      
      if (!imageUrl && item['media:thumbnail'] && typeof item['media:thumbnail'] === 'object') {
        const mediaThumbnail = item['media:thumbnail'] as { $?: { url?: string } };
        imageUrl = mediaThumbnail.$ && mediaThumbnail.$.url;
      }
      
      if (!imageUrl && item.enclosure && typeof item.enclosure === 'object') {
        const enclosure = item.enclosure as { url?: string; type?: string };
        if (enclosure.url && enclosure.type?.startsWith('image/')) {
          imageUrl = enclosure.url;
        }
      }

      if (!imageUrl && item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }

      articles.push({
        title: item.title,
        url: item.link,
        imageUrl,
        source: feedConfig.name,
        pubDate: item.pubDate ? new Date(item.pubDate) : undefined,
      });
    }

    return articles;
  } catch (error) {
    console.error(`Error fetching RSS feed from ${feedConfig.name}:`, error);
    return [];
  }
}

export async function fetchAllRSSFeeds(limitPerFeed: number = 5): Promise<ParsedArticle[]> {
  const allArticles: ParsedArticle[] = [];

  for (const feedConfig of RSS_FEEDS) {
    const articles = await fetchRSSFeed(feedConfig, limitPerFeed);
    allArticles.push(...articles);
  }

  return allArticles;
}
