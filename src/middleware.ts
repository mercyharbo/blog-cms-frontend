import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')
  const pathname = request.nextUrl.pathname

  // Always allow access to the verification callback page
  if (pathname === '/auth/callback') {
    return NextResponse.next()
  }

  const isAuthPage = pathname === '/' || pathname === '/signup'

  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to login page when accessing protected routes
  if (!isAuthPage && !accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/signup', '/dashboard/:path*', '/auth/callback'],
}
