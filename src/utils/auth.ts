import { AuthUser } from '@/lib/supabase'

// Role-based redirect utility
export const getDashboardRedirect = (user: AuthUser | null): string => {
  console.log('🎯 getDashboardRedirect called with user:', user?.email)
  
  if (!user) {
    console.log('❌ No user, redirecting to login')
    return '/auth/login'
  }
  
  const role = user.user_metadata?.role || 'user'
  console.log('👤 User role:', role)
  
  const redirectPath = role === 'admin' ? '/dashboard' : '/dashboard/user'
  console.log('🔄 Redirecting to:', redirectPath)
  
  return redirectPath
}

// Check if user can access a specific page
export const canAccessPage = (user: AuthUser | null, page: string): boolean => {
  if (!user) return false
  
  const role = user.user_metadata?.role || 'user'
  
  const pagePermissions = {
    '/dashboard': true, // All authenticated users
    '/dashboard/user': true, // All authenticated users
    '/dashboard/shop': role === 'admin',
    '/dashboard/analytics': role === 'admin',
    '/dashboard/finance': role === 'admin',
    '/dashboard/orders': role === 'admin',
    '/dashboard/donations': role === 'admin',
    '/dashboard/programs': true, // All users can view programs
    '/dashboard/blog': true, // All users can view blog
    '/dashboard/donate': true, // All users can donate
    '/dashboard/reports': role === 'admin',
    '/dashboard/settings': role === 'admin',
  }
  
  return pagePermissions[page as keyof typeof pagePermissions] || false
}

// Get appropriate redirect for unauthorized access
export const getUnauthorizedRedirect = (user: AuthUser | null): string => {
  if (!user) {
    return '/auth/login'
  }
  
  const role = user.user_metadata?.role || 'user'
  return role === 'admin' ? '/dashboard' : '/dashboard/user'
}

// Get user role
export const getUserRole = (user: AuthUser | null): 'admin' | 'user' => {
  if (!user) return 'user'
  return user.user_metadata?.role || 'user'
}

// Get user name
export const getUserName = (user: AuthUser | null): string => {
  if (!user) return ''
  return user.user_metadata?.name || user.email || ''
}
