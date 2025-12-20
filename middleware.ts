import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is logged in by checking for auth token in cookies or headers
  // Since we're using localStorage on client side, we'll check for a cookie set on login
  // For now, we'll check if there's a cookie or we can check on the client side
  // In a production app, you'd want to verify the token server-side
  
  // Get the auth cookie if it exists
  const authCookie = request.cookies.get('velvetZenith_auth');
  const isLoggedIn = !!authCookie;

  // Protect /login and /signup routes - redirect logged-in users
  if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
    // Redirect to home page or dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect authenticated routes - redirect non-logged-in users to login
  if (!isLoggedIn && (pathname === '/account' || pathname === '/dashboard' || pathname === '/orders')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/account',
    '/dashboard',
    '/orders',
  ],
};

