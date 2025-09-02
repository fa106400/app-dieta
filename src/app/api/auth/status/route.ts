import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { cookieUtils } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    const accessToken = cookieUtils.getAccessToken(cookieHeader)
    
    if (!accessToken) {
      return NextResponse.json({ 
        authenticated: false, 
        user: null 
      })
    }

    const supabase = createServerSupabaseClient()
    
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