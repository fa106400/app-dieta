import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes do not require authentication
// const publicRoutes: string[] = [
//   '/',
//   '/login',
//   '/signup',
//   '/forgot-password',
//   '/reset-password',
//   '/plans',
//   '/terms',
//   '/privacy',
//   '/faq',
//   '/api/healthz',
//   '/api/auth/status',
//   '/api/auth/refresh',
//   '/api/auth/logout'
// ]

// Routes intended for authenticated users should redirect away if already logged in
const authOnlyLandingRoutes: string[] = ['/login', '/signup', '/forgot-password', '/reset-password']

// API routes that require authentication
const protectedApiRoutes: string[] = []

// Prefix considered protected (app area)
const protectedPrefix = '/(app)'

// function isPublicPath(pathname: string): boolean {
//   return publicRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
// }

function isAuthLandingPath(pathname: string): boolean {
  return authOnlyLandingRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function isProtectedApiPath(pathname: string): boolean {
  return protectedApiRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

// With @supabase/ssr, trust Supabase cookies by presence, no manual parsing
function hasAnySupabaseCookie(req: NextRequest): boolean {
  return Boolean(
    req.cookies.get('sb-access-token')?.value ||
    req.cookies.get('sb-refresh-token')?.value
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  const hasAuthTokens = hasAnySupabaseCookie(req)
  const isProtected = pathname.startsWith(protectedPrefix)
  const isAuthLanding = isAuthLandingPath(pathname)
  const isProtectedApi = isProtectedApiPath(pathname)
  
  // Gate protected routes by auth
  if (isProtected && !hasAuthTokens) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Gate protected API routes by auth
  if (isProtectedApi && !hasAuthTokens) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // If already logged in, keep users away from auth pages to app home
  if (hasAuthTokens && isAuthLanding) {
    const url = req.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  /*matcher: [
    // Run on everything in app, plus auth/public pages we care about
    '/((public|app).*)',
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/plans',
    '/terms',
    '/privacy',
    '/faq',
    '/api/healthz'
  ]*/
 matcher: ['/:path*']
}


