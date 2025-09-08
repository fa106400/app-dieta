import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ 
      authenticated: false, 
      user: null,
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
        authenticated: false, 
        user: null,
        session: null,
        error: 'Supabase client not available'
      }, { status: 503 })
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()

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
      session: null
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