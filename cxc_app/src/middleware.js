import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const publicPages = ['/login', '/register', '/'];
  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.token;

  if (!token) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

//applying middleware to these routes:
export const config = {
  matcher: ['story/:path*'],
};
