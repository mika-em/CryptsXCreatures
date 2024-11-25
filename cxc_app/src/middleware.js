import { API } from './app/constants/api';
import { NextResponse } from 'next/server';

async function verifyToken(token) {
  const res = await fetch(`${API}/verifyjwt`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Token verification failed');
  }

  return res.json();
}

function roleBasedRedirect(req, role) {
  const url = req.nextUrl.clone();

  if (req.nextUrl.pathname === '/login') {
    url.pathname = role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    return NextResponse.redirect(url);
  }

  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    console.warn(
      'Non-admin user attempting to access /admin. Redirecting to /.'
    );
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/user') && role !== 'user') {
    console.warn('non-user attempting to access /user. Redirecting to /.');
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/story') && role !== 'user') {
    console.warn('Unauthorized access to /story. Redirecting to /login.');
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return null;
}

export async function middleware(req) {
  const token = req.cookies.get('token');
  const publicRoutes = ['/login', '/register', '/'];

  if (publicRoutes.includes(req.nextUrl.pathname)) {
    console.log('Public route. Skipping authentication.');
    return NextResponse.next();
  }

  if (!token) {
    console.warn('No token found. Redirecting to home.');
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const decoded = await verifyToken(token.value);
    const role = decoded.role;

    const redirectResponse = roleBasedRedirect(req, role);
    if (redirectResponse) return redirectResponse;

    if (req.nextUrl.pathname.startsWith('/story')) {
      console.log('Token verified. Granting access to /story.');
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (e) {
    console.error('Middleware error:', e.message);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/story/:path*', '/admin/:path*', '/user/:path*', '/login'],
};
