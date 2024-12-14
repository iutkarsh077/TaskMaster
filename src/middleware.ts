import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/', '/dashboard', '/login', '/sign-up'],
}

export function middleware(request: NextRequest) {
  const getUserCookie = request.cookies.get("taskList")?.value;
  const url = request.nextUrl;

  if (getUserCookie && (url.pathname === "/login" || url.pathname === "/sign-up")) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!getUserCookie && (url.pathname === "/" || url.pathname === "/dashboard")) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}