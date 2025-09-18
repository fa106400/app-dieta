import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  console.log('🔍 GET /api/auth/me - Starting request')
  
  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Supabase environment variables not configured')
    return NextResponse.json({ 
      error: 'Supabase not configured'
    }, { status: 503 })
  }

  try {
    // Import dynamically to avoid build-time issues
    const { createRouteSupabaseClient } = await import('@/lib/supabase-route')
    const res = NextResponse.next()
    const supabase = createRouteSupabaseClient(_request, res)
    
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase client not available'
      }, { status: 503 })
    }
    
    // Get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Invalid authentication token'
      }, { status: 401 })
    }

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // If profile doesn't exist, return user info without profile
    if (profileError && profileError.code === 'PGRST116') {
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url,
          created_at: user.created_at,
          email_confirmed_at: user.email_confirmed_at
        },
        profile: null,
        hasProfile: false
      })
    }

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url,
          created_at: user.created_at,
          email_confirmed_at: user.email_confirmed_at
        },
        profile: null,
        hasProfile: false
      })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at
      },
      profile: profile,
      hasProfile: true
    })
  } catch (error) {
    console.error('Auth me endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(_request: NextRequest) {
  console.log('🔍 PUT /api/auth/me - Starting request')
  
  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Supabase environment variables not configured')
    return NextResponse.json({ 
      error: 'Supabase not configured'
    }, { status: 503 })
  }

  try {
    // Import dynamically to avoid build-time issues
    const { createRouteSupabaseClient } = await import('@/lib/supabase-route')
    const res = NextResponse.next()
    const supabase = createRouteSupabaseClient(_request, res)
    
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase client not available'
      }, { status: 503 })
    }
    
    // Get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Invalid authentication token'
      }, { status: 401 })
    }

    // Parse request body
    const body = await _request.json()
    console.log('🔍 PUT /api/auth/me - Request body:', body)
    const { name, avatar_url, ...otherProfileData } = body
    console.log('🔍 PUT /api/auth/me - Extracted fields:', { name, avatar_url, otherProfileData })

    // Update user metadata if name provided (avatar_url goes to profile table)
    if (name) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: name || user.user_metadata?.name
        }
      })

      if (updateError) {
        return NextResponse.json({ 
          error: 'Failed to update user metadata'
        }, { status: 400 })
      }
    }

    // Update profile in profiles table (only valid profile fields)
    const validProfileFields = {
      name: name || undefined,
      age: otherProfileData.age,
      height_cm: otherProfileData.height_cm,
      weight_start_kg: otherProfileData.weight_start_kg,
      goal: otherProfileData.goal,
      dietary_preferences: otherProfileData.dietary_preferences,
      activity_level: otherProfileData.activity_level,
      food_dislikes: otherProfileData.food_dislikes,
      onboarding_completed: otherProfileData.onboarding_completed,
      user_alias: otherProfileData.user_alias,
      avatar_url: avatar_url, // Use avatar_url from main body, not otherProfileData
      updated_at: new Date().toISOString()
    }

    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(validProfileFields).filter(([, value]) => value !== undefined)
    )
    console.log('🔍 PUT /api/auth/me - Update data for profiles table:', updateData)

    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (profileError) {
      console.error('Error updating profile:', profileError)
      return NextResponse.json({ 
        error: 'Failed to update profile'
      }, { status: 400 })
    }

    console.log('🔍 PUT /api/auth/me - Updated profile:', updatedProfile);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: name || user.user_metadata?.name || user.email?.split('@')[0],
        avatar_url: avatar_url || user.user_metadata?.avatar_url,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at
      },
      profile: updatedProfile,
      hasProfile: true
    })
  } catch (error) {
    console.error('Auth me update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
