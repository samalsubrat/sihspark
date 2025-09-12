import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // If user is authenticated and trying to access auth pages, redirect to app
  if (token && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to signin
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/app'))) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
