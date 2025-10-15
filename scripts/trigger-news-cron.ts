import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function triggerNewsCron() {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const CRON_SECRET = process.env.CRON_SECRET;

  if (!CRON_SECRET) {
    process.exit(1);
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!GOOGLE_API_KEY) {
    process.exit(1);
  }

  try {
    const response = await fetch(`${BASE_URL}/api/cron/news`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error response:', {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error triggering cron job:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('Make sure your development server is running:');
      }
    }
    
    process.exit(1);
  }
}

triggerNewsCron();
