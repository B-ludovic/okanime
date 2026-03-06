import { NextResponse } from 'next/server';

export function middleware(request) {
  const authRole = request.cookies.get('auth')?.value;

  if (!authRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
