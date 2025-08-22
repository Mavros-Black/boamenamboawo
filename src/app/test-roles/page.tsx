'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import RoleBadge from '@/components/RoleBadge'
import { canAccessPage } from '@/utils/auth'
import { hasPermission } from '@/utils/roles'

export default function TestRolesPage() {
  const { user } = useAuth()
  const [testPage] = useState('/dashboard/shop')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Role Testing</h1>
          <p className="text-gray-600">Please log in to test role-based access control.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Role-Based Access Control Test</h1>
          
          {/* User Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current User</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <RoleBadge role={user?.user_metadata?.role || 'user'} />
              </div>
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Access Control Tests */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Page Access Tests</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can access {testPage}:</span>
                  <span className={`font-medium ${canAccessPage(user, testPage) ? 'text-green-600' : 'text-red-600'}`}>
                    {canAccessPage(user, testPage) ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can access /dashboard/user:</span>
                  <span className={`font-medium ${canAccessPage(user, '/dashboard/user') ? 'text-green-600' : 'text-red-600'}`}>
                    {canAccessPage(user, '/dashboard/user') ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can access /dashboard/analytics:</span>
                  <span className={`font-medium ${canAccessPage(user, '/dashboard/analytics') ? 'text-green-600' : 'text-red-600'}`}>
                    {canAccessPage(user, '/dashboard/analytics') ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Permission Tests</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can manage shop:</span>
                  <span className={`font-medium ${hasPermission(user?.user_metadata?.role || 'user', 'SHOP_MANAGEMENT', 'create') ? 'text-green-600' : 'text-red-600'}`}>
                    {hasPermission(user?.user_metadata?.role || 'user', 'SHOP_MANAGEMENT', 'create') ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can view analytics:</span>
                  <span className={`font-medium ${hasPermission(user?.user_metadata?.role || 'user', 'ANALYTICS', 'view') ? 'text-green-600' : 'text-red-600'}`}>
                    {hasPermission(user?.user_metadata?.role || 'user', 'ANALYTICS', 'view') ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Can make donations:</span>
                  <span className={`font-medium ${hasPermission(user?.user_metadata?.role || 'user', 'DONATIONS', 'make-donation') ? 'text-green-600' : 'text-red-600'}`}>
                    {hasPermission(user?.user_metadata?.role || 'user', 'DONATIONS', 'make-donation') ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Navigation Access</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Admin Navigation:</span>
                  <span className={`font-medium ${user?.user_metadata?.role === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.user_metadata?.role === 'admin' ? '✅ Available' : '❌ Hidden'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Navigation:</span>
                  <span className="font-medium text-green-600">✅ Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Main Navigation:</span>
                  <span className="font-medium text-green-600">✅ Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Testing Instructions</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Log in as different users to see how access changes</li>
              <li>• Try accessing admin-only pages as a regular user</li>
              <li>• Check the dashboard navigation for role-specific menus</li>
              <li>• Test API endpoints with different user roles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

