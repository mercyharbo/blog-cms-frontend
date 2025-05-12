import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // Allow unauthenticated access to public auth pages
  const publicPaths = ['/signup', '/forget-password']
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow unauthenticated access to reset-password if token param exists
  if (pathname === '/auth/reset-password' && searchParams.has('token')) {
    return NextResponse.next()
  }

  // If user is authenticated and tries to access the login page (root path),
  // redirect them to dashboard
  if (pathname === '/' && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not authenticated, redirect to login (root)
  if (!accessToken && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow access
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)'],
}
