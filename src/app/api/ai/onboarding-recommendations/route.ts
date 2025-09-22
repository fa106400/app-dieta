import { NextRequest, NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase-route';
import { aiService, UserProfile } from '@/lib/ai-service';

export async function GET() {
  return NextResponse.json({ 
    message: 'Onboarding Recommendations API is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createRouteSupabaseClient(request, res);
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not available' },
        { status: 503 }
      );
    }
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
        { error: 'User profile not found', details: profileError?.message },
        { status: 404 }
      );
    }

    // Check if onboarding is completed
    if (!profile.onboarding_completed) {
      return NextResponse.json(
        { error: 'Onboarding not completed' },
        { status: 400 }
      );
    }

    if (!profile.onboarding_completed) {
      return NextResponse.json(
        { error: 'Onboarding not completed' },
        { status: 400 }
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
        difficulty,
        calories_total,
        shopping_plan,
        tags
      `)
      .eq('is_public', true)
      .order('popularity_score', { ascending: false })
      .limit(50);

    if (dietsError || !diets) {
      console.error('🔍 Onboarding Recommendations - Failed to fetch diets, returning 500');
      return NextResponse.json(
        { error: 'Failed to fetch available diets', details: dietsError?.message },
        { status: 500 }
      );
    }

    // Filter out diets with null values
    const validDiets = diets.filter(diet => 
      diet.id && diet.title && diet.description && diet.category && 
      diet.difficulty && diet.calories_total && diet.tags
    ) as Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty: string;
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

    const aiResponse = await aiService.generateInitialRecommendations(
      user.id,
      userProfile,
      validDiets
    );

    if (!aiResponse.success) {
      console.error('🔍 Onboarding Recommendations - AI service failed, returning 500');
      return NextResponse.json(
        { 
          error: aiResponse.error,
          message: 'Failed to generate recommendations. You can try again later.'
        },
        { status: 500 }
      );
    }

    if (!aiResponse.recommendations || aiResponse.recommendations.length === 0) {
      console.error('🔍 Onboarding Recommendations - No recommendations generated, returning 500');
      return NextResponse.json(
        { error: 'No recommendations generated' },
        { status: 500 }
      );
    }

    //first, delete all recommendations for the user
    const { error: deleteError } = await supabase
      .from('diet_recommendations')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) {
      console.error('Error deleting recommendations:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete recommendations', details: deleteError.message },
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
      console.error('Error saving onboarding recommendations:', insertError);
      return NextResponse.json(
        { error: 'Failed to save recommendations', details: insertError.message },
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
          difficulty: diet.difficulty,
          calories_total: diet.calories_total,
          tags: diet.tags,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      recommendations: recommendationsWithDetails,
      generatedAt: new Date().toISOString(),
      message: 'Initial recommendations generated successfully!'
    });

  } catch (error) {
    console.error('Error in onboarding recommendations API:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
