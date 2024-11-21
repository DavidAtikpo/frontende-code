import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Vérifie si la route commence par /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Ne pas appliquer le Header général
    return NextResponse.next()
  }

  // Pour toutes les autres routes, continuer normalement
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 