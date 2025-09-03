import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes do not require authentication
const publicRoutes: string[] = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/plans',
  '/terms',
  '/privacy',
  '/faq',
  '/api/healthz',
  '/api/auth/status',
  '/api/auth/refresh',
  '/api/auth/logout'
]

// Routes intended for authenticated users should redirect away if already logged in
const authOnlyLandingRoutes: string[] = ['/login', '/signup', '/forgot-password', '/reset-password']

// API routes that require authentication
const protectedApiRoutes: string[] = ['/api/auth/me']

// Prefix considered protected (app area)
const protectedPrefix = '/(app)'

function isPublicPath(pathname: string): boolean {
  return publicRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function isAuthLandingPath(pathname: string): boolean {
  return authOnlyLandingRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function isProtectedApiPath(pathname: string): boolean {
  return protectedApiRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function hasValidAuthTokens(req: NextRequest): boolean {
  const accessToken = req.cookies.get('sb-access-token')?.value
  const refreshToken = req.cookies.get('sb-refresh-token')?.value
  
  // Check for both access and refresh tokens
  return Boolean(accessToken || refreshToken)
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const hasAuthTokens = hasValidAuthTokens(req)
  const isProtected = pathname.startsWith('/(app)')
  const isPublic = isPublicPath(pathname)
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

  // Public routes pass through
  if (isPublic) {
    return NextResponse.next()
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


