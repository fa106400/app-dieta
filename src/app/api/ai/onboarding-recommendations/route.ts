import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { aiService, UserProfile } from '@/lib/ai-service';
import type { Database } from '../../../../../supabase';

export async function POST(_request: NextRequest) {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 Onboarding Recommendations - Generating for user:', user.id);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
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

    // Get available diets
    const { data: diets, error: dietsError } = await supabase
      .from('diet_catalog_view')
      .select(`
        id,
        title,
        description,
        category,
        difficulty,
        calories_total,
        tags
      `)
      .eq('is_public', true)
      .order('popularity_score', { ascending: false })
      .limit(50);

    if (dietsError || !diets) {
      return NextResponse.json(
        { error: 'Failed to fetch available diets' },
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

    // Generate initial recommendations using AI service
    const aiResponse = await aiService.generateInitialRecommendations(
      user.id,
      userProfile,
      validDiets
    );

    if (!aiResponse.success) {
      return NextResponse.json(
        { 
          error: aiResponse.error,
          message: 'Failed to generate recommendations. You can try again later.'
        },
        { status: 500 }
      );
    }

    if (!aiResponse.recommendations || aiResponse.recommendations.length === 0) {
      return NextResponse.json(
        { error: 'No recommendations generated' },
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
        { error: 'Failed to save recommendations' },
        { status: 500 }
      );
    }

    console.log('🔍 Onboarding Recommendations - Generated and saved', aiResponse.recommendations.length, 'recommendations');

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
