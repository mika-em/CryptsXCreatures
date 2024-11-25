import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('token');
  const url = req.nextUrl.clone();

  const publicRoutes = ['/', '/login', '/register'];
  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [],
};
