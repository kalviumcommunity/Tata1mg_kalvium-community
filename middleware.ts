import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

const ROLE_ROUTES: Record<string, string> = {
  '/admin': 'ADMIN',
  '/doctor': 'DOCTOR',
  '/pharmacist': 'PHARMACIST',
};

const ROLE_HOME: Record<string, string> = {
  ADMIN: '/admin',
  DOCTOR: '/doctor',
  PHARMACIST: '/pharmacist',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find matching protected route prefix
  const matchedPrefix = Object.keys(ROLE_ROUTES).find((prefix) => pathname.startsWith(prefix));
  if (!matchedPrefix) return NextResponse.next();

  const requiredRole = ROLE_ROUTES[matchedPrefix];
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    // Middleware runs on Edge — decode JWT payload without crypto verification
    // (full cryptographic verification happens in every protected API route via lib/auth.ts)
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('malformed');

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));

    // Check expiry
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      const res = NextResponse.redirect(new URL('/auth', request.url));
      res.cookies.set(SESSION_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return res;
    }

    // Wrong role redirect
    if (payload.role !== requiredRole) {
      const home = ROLE_HOME[payload.role] ?? '/auth';
      return NextResponse.redirect(new URL(home, request.url));
    }

    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/auth', request.url));
    res.cookies.set(SESSION_COOKIE_NAME, '', { maxAge: 0, path: '/' });
    return res;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/doctor/:path*', '/pharmacist/:path*'],
};
