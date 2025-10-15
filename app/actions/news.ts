'use server';

import { getLatestNews } from '@/app/lib/news-service';

export async function getNews() {
  try {
    const news = await getLatestNews();
    return news;
  } catch (error) {
    console.error('Error in getNews action:', error);
    return [];
  }
}
