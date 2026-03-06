import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const padded = payloadBase64.padEnd(
      payloadBase64.length + (4 - (payloadBase64.length % 4)) % 4,
      '='
    );
    const payload = JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')));

    if (payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
