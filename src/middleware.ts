import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')
  const pathname = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = [
    '/signup',
    '/forget-password',
    '/reset-password',
    '/verify',
  ]

  // Check if the current path is a public path or starts with /reset-password
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/reset-password')
  ) {
    return NextResponse.next()
  }

  // If user is authenticated and tries to access the login page (root path),
  // redirect them to dashboard
  if (pathname === '/' && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not authenticated and trying to access a protected route,
  // redirect to login (root)
  if (!accessToken && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow access
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)'],
}
