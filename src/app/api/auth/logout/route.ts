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
    const accessToken = cookieUtils.getAccessToken(cookieHeader)
    
    const supabase = createServerSupabaseClient()
    
    if (supabase && accessToken) {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Supabase logout error:', error)
        // Continue with cookie cleanup even if Supabase logout fails
      }
    }

    // Clear all auth-related cookies
    const response = NextResponse.json({
      message: 'Logged out successfully'
    })

    // Clear all possible auth cookies
    const authCookies = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-access-token.0',
      'sb-access-token.1',
      'sb-refresh-token.0',
      'sb-refresh-token.1'
    ]

    authCookies.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        expires: new Date(0)
      })
    })

    return response
  } catch (error) {
    console.error('Auth logout error:', error)
    
    // Even if there's an error, try to clear cookies
    const response = NextResponse.json(
      { error: 'Logout completed with errors' },
      { status: 500 }
    )

    // Clear cookies on error too
    const authCookies = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-access-token.0',
      'sb-access-token.1',
      'sb-refresh-token.0',
      'sb-refresh-token.1'
    ]

    authCookies.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        expires: new Date(0)
      })
    })

    return response
  }
}
