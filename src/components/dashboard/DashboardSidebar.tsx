'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Users,
  ShoppingCart,
  Heart,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  DollarSign,
  Target,
  Menu,
  X,
} from 'lucide-react'

export default function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  const isAdmin = user?.user_metadata?.role === 'admin'

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      showFor: ['admin', 'user'],
    },
    {
      name: 'Events',
      href: '/dashboard/events',
      icon: Calendar,
      showFor: ['admin'],
    },
    {
      name: 'Users',
      href: '/dashboard/users',
      icon: Users,
      showFor: ['admin'],
    },
    {
      name: 'Programs',
      href: '/dashboard/programs',
      icon: Target,
      showFor: ['admin', 'user'],
    },
    {
      name: 'Donations',
      href: '/dashboard/donations',
      icon: Heart,
      showFor: ['admin'],
    },
    {
      name: 'Orders',
      href: '/dashboard/orders',
      icon: ShoppingCart,
      showFor: ['admin'],
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      showFor: ['admin'],
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: FileText,
      showFor: ['admin'],
    },
    {
      name: 'Finance',
      href: '/dashboard/finance',
      icon: DollarSign,
      showFor: ['admin'],
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      showFor: ['admin', 'user'],
    },
  ]

  const filteredNavigation = navigationItems.filter(item =>
    item.showFor.includes(user?.user_metadata?.role || 'user')
  )

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = pathname === item.href
    const isEventsItem = item.name === 'Events'
    return (
      <Link
        href={item.href}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-green-100 text-green-700'
            : isEventsItem && process.env.NODE_ENV === 'development'
            ? 'text-red-600 hover:bg-red-50 hover:text-red-900 border-2 border-red-300'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
        {isEventsItem && process.env.NODE_ENV === 'development' && (
          <span className="ml-2 text-xs bg-red-100 text-red-800 px-1 rounded">DEBUG</span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <p>Role: {user?.user_metadata?.role || 'undefined'}</p>
                <p>Items shown: {filteredNavigation.length}</p>
                <p>Items: {filteredNavigation.map(item => item.name).join(', ')}</p>
                <p>Events in list: {navigationItems.find(item => item.name === 'Events') ? 'YES' : 'NO'}</p>
              </div>
            )}
            {filteredNavigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* User info */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.user_metadata?.name || user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.user_metadata?.role || 'user'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

