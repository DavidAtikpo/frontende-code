import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAdminLoginPage = request.nextUrl.pathname === '/adminLogin'
  const isAdminDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard')

  // If on the login page and already authenticated, redirect to the dashboard
  if (isAdminLoginPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // If trying to access the dashboard without being authenticated, redirect to login
  if (isAdminDashboard && !token) {
    return NextResponse.redirect(new URL('/adminLogin', request.url))
  }

  // Optionally, you can add a check to validate the token here
  // For example, you could call an API to verify the token

  return NextResponse.next()
}

export const config = {
  matcher: ['/adminLogin', '/admin/dashboard/:path*']
} 