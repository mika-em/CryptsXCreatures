import { API } from './app/constants/api';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Log all cookies for debugging
  const token = req.cookies.get('token');
  console.log('Middleware Cookies:', req.cookies.getAll());
  console.log('Middleware Token:', token?.value);

  // Allow public routes without authentication
  const publicRoutes = ['/login', '/register', '/'];
  if (publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect if no token is found
  if (!token) {
    console.log('No token found. Redirecting to home.');
    return NextResponse.next(); // Allow access but note missing token for debugging
  }

  try {
    // Send the token to the backend for verification
    const res = await fetch(`${API}/verifyjwt`, {
      method: 'GET',
      credentials: 'include', // Ensure cookies are included
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    console.log('Verify-Token Response:', await res.text());

    if (!res.ok) {
      throw new Error('Invalid token');
    }

    const decoded = await res.json();
    console.log('Decoded token:', decoded);

    // Check if accessing admin routes requires admin privileges
    if (req.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'admin') {
      console.log('Access denied for non-admin user.');
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.next(); // Prevent redirection, but log the error
  }
}

export const config = {
  matcher: ['/admin/:path*', '/story/:path*', '/'],
};