import { NextRequest, NextResponse } from 'next/server';
import { SERVER_DOMAIN } from './config';
import { logger } from './lib/logger';

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get('token');
  const path = request.nextUrl.pathname;

  logger.debug('Proxy request', { path, hasToken: !!cookie });

  if (!cookie && path !== '/login' && path !== '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const res = await fetch(`${SERVER_DOMAIN}/profile`, {
    headers: {
      Authorization: cookie?.value as string,
    },
  });

  if (res.status === 401 && path !== '/login' && path !== '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!path.startsWith('/dashboard') && res.status === 200) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register'],
};
