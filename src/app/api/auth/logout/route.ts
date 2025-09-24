import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ 
      error: 'Supabase não configurado'
    }, { status: 503 })
  }

  try {
    // Import dynamically to avoid build-time issues
    const { createRouteSupabaseClient } = await import('@/lib/supabase-route')
    const res = NextResponse.next()
    const supabase = createRouteSupabaseClient(_request, res)

    if (supabase) {
      // Sign out from Supabase (SSR client manages cookies)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro ao deslogar do Supabase:', error)
        // Continue with cookie cleanup even if Supabase logout fails
      }
    }

    // Clear all auth-related cookies
    const response = NextResponse.json({
      message: 'Deslogado com sucesso'
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
    console.error('Erro ao deslogar:', error)
    
    // Even if there's an error, try to clear cookies
    const response = NextResponse.json(
      { error: 'Deslogado com erros' },
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
