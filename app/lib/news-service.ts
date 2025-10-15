import { prisma } from '@/app/lib/prisma';

/**
 * Get today's latest news from the database
 */
export async function getLatestNews() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const news = await prisma.news.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
