import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Vérifier si la route commence par /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclure la page de login admin
    if (request.nextUrl.pathname === '/adminLogin') {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get('token');

    // Rediriger vers la page de login si pas de token ou pas admin
    if (!adminToken || localStorage.getItem('role') !== 'admin') {
      return NextResponse.redirect(new URL('/adminLogin', request.url));
    }
  }

  return NextResponse.next();
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!adminLogin|api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 