import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Handle favicon.ico requests
  if (req.nextUrl.pathname === '/favicon.ico') {
    // Redirect to the SVG favicon
    return NextResponse.redirect(new URL('/favicon.svg', req.url))
  }
  
  // Temporarily disable middleware for testing
  return NextResponse.next()
  
  // Original middleware code commented out for now
  /*
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/shop',
    '/dashboard/orders',
    '/dashboard/donations',
    '/dashboard/analytics',
    '/dashboard/finance',
    '/dashboard/programs',
    '/dashboard/blog',
    '/dashboard/settings',
    '/dashboard/reports',
  ]

  // Define admin-only routes
  const adminRoutes = [
    '/dashboard/shop',
    '/dashboard/analytics',
    '/dashboard/finance',
    '/dashboard/orders',
    '/dashboard/donations',
    '/dashboard/reports',
    '/dashboard/settings',
  ]

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  const isAdminRoute = adminRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing admin route, check if user is admin
  if (isAdminRoute && session) {
    const userRole = session.user.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      // Redirect non-admin users to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // If accessing auth pages while logged in, redirect to dashboard
  if (session && (req.nextUrl.pathname.startsWith('/auth/login') || req.nextUrl.pathname.startsWith('/auth/register'))) {
    const userRole = session.user.user_metadata?.role || 'user'
    const redirectPath = userRole === 'admin' ? '/dashboard' : '/dashboard/user'
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  return response
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|public).*)',
  ],
}