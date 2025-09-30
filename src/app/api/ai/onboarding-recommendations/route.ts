import { NextRequest, NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase-route';
import { aiService, UserProfile } from '@/lib/ai-service';

export async function GET() {
  return NextResponse.json({ 
    message: 'Onboarding Recommendations API está funcionando',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client não disponível' },
        { status: 503 }
      );
    }
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil do usuário não encontrado', details: profileError?.message },
        { status: 404 }
      );
    }

    // Check if onboarding is completed
    if (!profile.onboarding_completed) {
      return NextResponse.json(
        { error: 'Onboarding não completado' },
        { status: 400 }
      );
    }

    if (!profile.onboarding_completed) {
      return NextResponse.json(
        { error: 'Onboarding não completado' },
        { status: 400 }
      );
    }

    // Get available diets filtered by user's estimated calories
    let dietsQuery = supabase
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
      .eq('is_public', true);

    // Filter by estimated_calories if available
    if (profile.estimated_calories) {
      dietsQuery = dietsQuery.eq('calories_total', profile.estimated_calories);
    }

    const { data: diets, error: dietsError } = await dietsQuery
      .order('title', { ascending: true })
      .limit(50);

    if (dietsError || !diets) {
      return NextResponse.json(
        { error: 'Falha ao buscar dietas disponíveis', details: dietsError?.message },
        { status: 500 }
      );
    }

    // Filter out diets with null values
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

    //logar cada dieta valida antes de mandar para ai
    console.log('[route.ts] User calories:', profile.estimated_calories);
    console.log('[route.ts] Diets before sending to AI:', validDiets);

    const aiResponse = await aiService.generateInitialRecommendations(
      user.id,
      userProfile,
      validDiets
    );

    if (!aiResponse.success) {
      return NextResponse.json(
        { 
          error: aiResponse.error,
          message: 'Falha ao gerar recomendações. Você pode tentar novamente mais tarde.'
        },
        { status: 500 }
      );
    }

    if (!aiResponse.recommendations || aiResponse.recommendations.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma recomendação gerada' },
        { status: 500 }
      );
    }

    //first, delete all recommendations for the user
    const { error: deleteError } = await supabase
      .from('diet_recommendations')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) {
      return NextResponse.json(
        { error: 'Falha ao deletar recomendações', details: deleteError.message },
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
      return NextResponse.json(
        { error: 'Falha ao salvar recomendações', details: insertError.message },
        { status: 500 }
      );
    }

    // Return recommendations with diet details
    const recommendationsWithDetails = aiResponse.recommendations.map(rec => {
      const diet = validDiets.find(d => d.id === rec.dietId);
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
      message: 'Initial recommendations geradas com sucesso!'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
