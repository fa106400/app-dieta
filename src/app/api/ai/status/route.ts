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
    console.error('Erro ao verificar status da AI:', error);
    return NextResponse.json(
      { 
        available: false,
        error: 'Falha ao verificar status do serviço da AI',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
