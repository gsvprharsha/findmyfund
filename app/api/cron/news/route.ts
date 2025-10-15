import { NextRequest, NextResponse } from 'next/server';
import { processAndStoreRSSNews } from '@/app/lib/news-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting RSS news fetch and processing...');
    const startTime = Date.now();

    const result = await processAndStoreRSSNews();

    const duration = Date.now() - startTime;
    console.log(`RSS news processing completed in ${duration}ms`);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Failed to process news', 
          details: result.error 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed and stored ${result.count} new articles`,
      count: result.count,
      duration: `${duration}ms`,
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
