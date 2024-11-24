import { API } from './app/constants/api';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('token');
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  if (isPublicRoute) {
    console.log('public route. skipping authentication.');
    return NextResponse.next();
  }

  if (!token) {
    console.warn('no token found. redirecting to /login.');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const res = await fetch(`${API}/verifyjwt`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!res.ok) {
      console.error('token verification failed. redirecting to /login.');
      throw new Error('Invalid token');
    }

    const decoded = await res.json();
    console.log('decoded token:', decoded);

    // if (req.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'admin') {
    //   console.warn(
    //     'non-admin user attempting to access /admin. redirecting to /.'
    //   );
    //   return NextResponse.redirect(new URL('/', req.url));
    // }

    return NextResponse.next();
  } catch (err) {
    console.error('middleware:', err.message);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/story/:path*'],
};
