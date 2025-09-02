import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ 
      authenticated: false, 
      user: null,
      error: 'Supabase not configured'
    })
  }

  try {
    // Import dynamically to avoid build-time issues
    const { createServerSupabaseClient } = await import('@/lib/supabase')
    const { cookieUtils } = await import('@/lib/auth')
    
    const cookieHeader = request.headers.get('cookie')
    const accessToken = cookieUtils.getAccessToken(cookieHeader)
    
    if (!accessToken) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null 
      })
    }

    const supabase = createServerSupabaseClient()
    
    if (!supabase) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null,
        error: 'Supabase client not available'
      })
    }
    
    // Verify the token and get user info
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error || !user) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null 
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0]
      }
    })
  } catch (error) {
    console.error('Auth status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}