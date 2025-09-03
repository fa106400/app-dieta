import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ 
      authenticated: false, 
      user: null,
      error: 'Supabase not configured'
    }, { status: 503 })
  }

  try {
    // Import dynamically to avoid build-time issues
    const { createServerSupabaseClient } = await import('@/lib/supabase')
    const { cookieUtils } = await import('@/lib/auth')
    
    const cookieHeader = request.headers.get('cookie')
    const accessToken = cookieUtils.getAccessToken(cookieHeader)
    const refreshToken = cookieUtils.getRefreshToken(cookieHeader)
    
    // If no tokens at all, user is not authenticated
    if (!accessToken && !refreshToken) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null,
        session: null
      })
    }

    const supabase = createServerSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null,
        session: null,
        error: 'Supabase client not available'
      }, { status: 503 })
    }
    
    // Try to get user with access token first
    let user = null
    let session = null
    let error = null

    if (accessToken) {
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser(accessToken)
      user = userData
      error = userError
    }

    // If access token failed but we have refresh token, try to refresh
    if ((error || !user) && refreshToken) {
      const { data: { session: sessionData }, error: sessionError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      })
      
      if (sessionData?.user) {
        user = sessionData.user
        session = sessionData
        error = null
      } else {
        error = sessionError
      }
    }
    
    if (error || !user) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null,
        session: null,
        error: error?.message || 'Authentication failed'
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at
      },
      session: session ? {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        expires_in: session.expires_in
      } : null
    })
  } catch (error) {
    console.error('Auth status check error:', error)
    return NextResponse.json(
      { 
        authenticated: false,
        user: null,
        session: null,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}