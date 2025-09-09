import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function GET() {
  try {
    const isAvailable = aiService.isAvailable();
    
    return NextResponse.json({
      available: isAvailable,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error checking AI status:', error);
    return NextResponse.json(
      { 
        available: false,
        error: 'Failed to check AI service status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
