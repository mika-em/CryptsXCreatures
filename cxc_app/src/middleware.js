import { API } from './app/constants/api';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('token');
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  const url = req.nextUrl.clone();

  //skip auth for public routes
  if (isPublicRoute) {
    console.log('public route. skipping authentication.');
    return NextResponse.next();
  }
  //redirect unauthenticated users to home page
  if (!token) {
    console.warn('no token found. redirecting to home.');
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    //verify token
    const res = await fetch(`${API}/verifyjwt`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!res.ok) {
      console.error('token verification failed. redirecting to /login.');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const decoded = await res.json();
    const role = decoded.role;

    //role based redirection from /login
    if (url.pathname === '/login') {
      if (role === 'admin') {
        url.pathname = '/admin-dashboard';
      } else if (role === 'user') {
        url.pathname = '/user-dashboard';
      }
      return NextResponse.redirect(url);
    }
    //protect story page for authenticated users only
    if (req.nextUrl.pathname.startsWith('/story')) {
      console.log('token verified. granting access to /story.');
      return NextResponse.next();
    }

    //role based protections after login
    //admin
    if (req.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'admin') {
      console.warn(
        'non-admin user attempting to access /admin. redirecting to /.'
      );
      return NextResponse.redirect(new URL('/', req.url));
    }
    //user
    if (req.nextUrl.pathname.startsWith('/user') && role !== "user") {
      console.warn(
        'non-user attempting to access /user. redirecting to /.'
      );
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  } catch (e) {
    console.error('middleware error:', e.message);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/story/:path*', '/admin/:path*', '/user/:path*', '/login']
};
