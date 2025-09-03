import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ 
      error: 'Supabase not configured'
    }, { status: 503 })
  }

  try {
    // Import dynamically to avoid build-time issues
    const { createServerSupabaseClient } = await import('@/lib/supabase')
    const { cookieUtils } = await import('@/lib/auth')
    
    const cookieHeader = request.headers.get('cookie')
    const refreshToken = cookieUtils.getRefreshToken(cookieHeader)
    
    if (!refreshToken) {
      return NextResponse.json({ 
        error: 'Refresh token required'
      }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase client not available'
      }, { status: 503 })
    }
    
    // Refresh the session
    const { data: { session }, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    })
    
    if (error || !session) {
      return NextResponse.json({ 
        error: 'Failed to refresh session'
      }, { status: 401 })
    }

    // Set new cookies for the refreshed session
    const response = NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
        avatar_url: session.user.user_metadata?.avatar_url,
        created_at: session.user.created_at,
        email_confirmed_at: session.user.email_confirmed_at
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        expires_in: session.expires_in
      }
    })

    // Set the new session cookies
    response.cookies.set('sb-access-token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: session.expires_in || 3600
    })

    response.cookies.set('sb-refresh-token', session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return response
  } catch (error) {
    console.error('Auth refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
