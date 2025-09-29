import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { aiService, UserProfile } from '@/lib/ai-service';
import type { Database } from '../../../../../supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { forceRefresh = false } = body;

    // Check if user can request new recommendations (per-user cooldown)
    const { data: lastRecommendation } = await supabase
      .from('diet_recommendations')
      .select('last_refreshed')
      .eq('user_id', user.id)
      .order('last_refreshed', { ascending: false })
      .limit(1)
      .single();

    if (!forceRefresh && lastRecommendation?.last_refreshed) {
      const cooldownCheck = aiService.canRequestRecommendations(
        user.id,
        lastRecommendation.last_refreshed
      );

      if (!cooldownCheck.allowed) {
        return NextResponse.json(
          { 
            error: 'Recomendações estão em cooldown',
            cooldownHours: cooldownCheck.cooldownHours,
            cooldownRemaining: cooldownCheck.cooldownRemaining,
            message: `Por favor, aguarde ${cooldownCheck.cooldownHours} horas antes de solicitar novas recomendações.`
          },
          { status: 429 }
        );
      }
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil do usuário não encontrado' },
        { status: 404 }
      );
    }

    // Get available diets
    const { data: diets, error: dietsError } = await supabase
      .from('diets')
      .select(`
        id,
        title,
        description,
        category,
        calories_total,
        shopping_plan,
        tags
      `)
      .eq('is_public', true)
      .order('title', { ascending: true })
      .limit(50); // Limit to top 50 diets for AI processing

    if (dietsError || !diets) {
      return NextResponse.json(
        { error: 'Falha ao buscar dietas disponíveis' },
        { status: 500 }
      );
    }

    // Prepare user profile for AI
    const userProfile: UserProfile = {
      userId: user.id,
      age: profile.age,
      weight: profile.weight_start_kg,
      height: profile.height_cm,
      activityLevel: profile.activity_level || undefined,
      dietaryRestrictions: profile.dietary_preferences || [],
      goals: [profile.goal],
      preferences: profile.food_dislikes ? [profile.food_dislikes] : [],
    };

    // Filter out diets with null values and generate recommendations using AI service
    const validDiets = diets.filter(diet => 
      diet.id && diet.title && diet.description && diet.category && 
      diet.calories_total && diet.tags
    ) as Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      // difficulty: string;
      calories_total: number;
      tags: string[];
    }>;

    const aiResponse = await aiService.generateDietRecommendations(
      userProfile,
      validDiets
    );

    if (!aiResponse.success) {
      return NextResponse.json(
        { 
          error: aiResponse.error,
          rateLimited: aiResponse.rateLimited,
          resetTime: aiResponse.resetTime
        },
        { status: aiResponse.rateLimited ? 429 : 500 }
      );
    }

    if (!aiResponse.recommendations || aiResponse.recommendations.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma recomendação gerada' },
        { status: 500 }
      );
    }

    // Save recommendations to database
    const now = new Date().toISOString();
    const recommendationInserts = aiResponse.recommendations.map(rec => ({
      user_id: user.id,
      diet_id: rec.dietId,
      score: rec.score,
      reasoning: rec.reasoning,
      generated_at: now,
      last_refreshed: now,
    }));

    const { error: insertError } = await supabase
      .from('diet_recommendations')
      .insert(recommendationInserts);

    if (insertError) {
      console.error('Erro ao salvar recomendações:', insertError);
      return NextResponse.json(
        { error: 'Falha ao salvar recomendações' },
        { status: 500 }
      );
    }

    // Return recommendations with diet details
    const recommendationsWithDetails = aiResponse.recommendations.map(rec => {
      const diet = diets.find(d => d.id === rec.dietId);
      return {
        ...rec,
        diet: diet ? {
          id: diet.id,
          title: diet.title,
          description: diet.description,
          category: diet.category,
          // difficulty: diet.difficulty,
          calories_total: diet.calories_total,
          tags: diet.tags,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      recommendations: recommendationsWithDetails,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Erro no API de recomendações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Get existing recommendations
    const { data: recommendations, error } = await supabase
      .from('diet_recommendations')
      .select(`
        id,
        score,
        reasoning,
        generated_at,
        last_refreshed,
        diets:diet_id (
          id,
          title,
          description,
          category,
          calories_total,
          tags
        )
      `)
      .eq('user_id', user.id)
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json(
        { error: 'Falha ao buscar recomendações' },
        { status: 500 }
      );
    }

    // Check cooldown status
    const lastRecommendation = recommendations?.[0];
    const cooldownCheck = aiService.canRequestRecommendations(
      user.id,
      lastRecommendation?.last_refreshed || undefined
    );

    // Get rate limit status
    const rateLimitStatus = aiService.getRateLimitStatus(user.id);

    return NextResponse.json({
      success: true,
      recommendations: recommendations || [],
      canRequestNew: cooldownCheck.allowed,
      cooldownRemaining: cooldownCheck.cooldownRemaining,
      rateLimitStatus,
    });

  } catch (error) {
    console.error('Erro ao buscar recomendações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
