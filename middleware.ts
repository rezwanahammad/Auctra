import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define protected routes
const protectedRoutes = ['/admin', '/dashboard', '/sell', '/favorites'] //these requires login
const adminRoutes = ['/admin']
const authRoutes = ['/auth/signin', '/auth/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // token from the request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect to signin if accessing protected route without token
  if (isProtectedRoute && !token) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Check admin access for admin routes
  if (isAdminRoute && token) {
    const userRole = (token as { role?: string }).role
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // if logged in then redirect away from auth pages and send to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

// Configure which routes use middleware
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
}
