import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')
  const isAuthPage =
    request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/signup'

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If trying to access protected routes without auth, redirect to login
  if (!isAuthPage && !accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/signup', '/dashboard/:path*'],
}
