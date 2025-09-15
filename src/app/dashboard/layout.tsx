'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { canAccessPage, getUnauthorizedRedirect } from '@/utils/auth'
import DashboardTopNav from '@/components/DashboardTopNav'
import RoleBadge from '@/components/RoleBadge'
import { 
  Home, 
  Package, 
  BarChart3, 
  DollarSign, 
  ShoppingCart, 
  Heart, 
  FileText, 
  Settings,
  Target,
  User,
  LogOut,
  Menu,
  X,
  Calendar
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!user) {
      console.log('🔄 Dashboard layout: No user, redirecting to login')
      router.push('/auth/login')
      return
    }

    // Redirect non-admin users to user dashboard when accessing main dashboard
    const userRole = user?.user_metadata?.role || 'user'
    if (user && userRole !== 'admin' && pathname === '/dashboard') {
      console.log('🔄 Dashboard layout: Non-admin user accessing main dashboard, redirecting to user dashboard')
      setIsRedirecting(true)
      // Add a small delay to prevent race conditions with login redirects
      setTimeout(() => {
        router.push('/dashboard/user')
      }, 50)
      return
    }

    // Handle redirects for other pages in useEffect to avoid render-time setState calls
    if (user && pathname !== '/dashboard' && pathname !== '/dashboard/user' && !canAccessPage(user, pathname)) {
      console.log('🔄 Dashboard layout: Unauthorized access, redirecting to:', getUnauthorizedRedirect(user))
      setIsRedirecting(true)
      const redirectPath = getUnauthorizedRedirect(user)
      router.push(redirectPath)
      return
    }
  }, [user, router, pathname])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const navigation: { name: string; href: string; icon: any; current: boolean }[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
    { name: 'Programs', href: '/dashboard/programs', icon: Target, current: false },
    { name: 'Blog', href: '/dashboard/blog', icon: FileText, current: false },
    { name: 'Donate', href: '/dashboard/donate', icon: Heart, current: false },
  ]

  // Admin-only navigation
  const adminNavigation = [
    { name: 'Events Management', href: '/dashboard/events', icon: Calendar, current: false },
    { name: 'Shop Management', href: '/dashboard/shop', icon: Package, current: false },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, current: false },
    { name: 'Finance', href: '/dashboard/finance', icon: DollarSign, current: false },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, current: false },
    { name: 'Donations', href: '/dashboard/donations', icon: Heart, current: false },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText, current: false },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, current: false },
  ]

  // User-only navigation
  const userNavigation = [
    { name: 'My Dashboard', href: '/dashboard/user', icon: Home, current: false },
    { name: 'My Orders', href: '/dashboard/user?tab=orders', icon: ShoppingCart, current: false },
    { name: 'My Donations', href: '/dashboard/user?tab=donations', icon: Heart, current: false },
    { name: 'My Programs', href: '/dashboard/user?tab=programs', icon: Target, current: false },
    { name: 'Profile', href: '/dashboard/user?tab=profile', icon: Settings, current: false },
  ]

  const isAdmin = user?.user_metadata?.role === 'admin'
  const isUserDashboard = pathname.startsWith('/dashboard/user')

  if (!user || isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Top Navigation */}
      <DashboardTopNav 
        onMenuClick={() => setSidebarOpen(true)}
        showMobileMenuButton={!isUserDashboard}
      />

      {/* Only show sidebar if NOT on user dashboard */}
      {!isUserDashboard && (
        <>
          {/* Mobile sidebar */}
          <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
              <div className="flex h-16 items-center justify-between px-4">
                <img 
                  src="/logo.svg" 
                  alt="BOA ME Youth Empowerment" 
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                
                {isAdmin && (
                  <>
                    <div className="pt-4 pb-2">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Admin
                      </h3>
                    </div>
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}

                {!isAdmin && (
                  <>
                    <div className="pt-4 pb-2">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        My Account
                      </h3>
                    </div>
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
              <div className="flex h-16 items-center px-4">
                <img 
                  src="/logo.svg" 
                  alt="BOA ME Youth Empowerment" 
                  className="h-10 w-auto"
                />
              </div>
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                
                {isAdmin && (
                  <>
                    <div className="pt-4 pb-2">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Admin
                      </h3>
                    </div>
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}

                {!isAdmin && (
                  <>
                    <div className="pt-4 pb-2">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        My Account
                      </h3>
                    </div>
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center px-2 py-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{user.user_metadata?.name || user.email}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <RoleBadge role={user?.user_metadata?.role || 'user'} size="sm" />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <div className={isUserDashboard ? "" : "lg:pl-64"}>
        {/* Page content */}
        <main className={isUserDashboard ? "" : "py-6"}>
          <div className={isUserDashboard ? "" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
