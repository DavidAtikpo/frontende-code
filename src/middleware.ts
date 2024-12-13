import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const userRole = request.cookies.get('userRole')?.value
  const isAdminLoginPage = request.nextUrl.pathname === '/adminLogin'
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')

  // Si l'utilisateur n'est pas authentifié
  if (!token && isAdminPath && !isAdminLoginPage) {
    return NextResponse.redirect(new URL('/adminLogin', request.url))
  }

  // Si l'utilisateur est authentifié mais n'est pas admin
  if (token && isAdminPath && userRole !== 'admin' && !isAdminLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Si l'utilisateur est déjà authentifié en tant qu'admin et essaie d'accéder à la page de login
  if (token && userRole === 'admin' && isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

// Mettre à jour le matcher pour inclure tous les chemins admin
export const config = {
  matcher: ['/adminLogin', '/admin/:path*']
} 