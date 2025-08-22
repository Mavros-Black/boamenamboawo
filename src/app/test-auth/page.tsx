'use client'

import { useAuth } from '@/contexts/AuthContext'
import { getUserRole, getUserName } from '@/utils/auth'

export default function TestAuthPage() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>
        
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ User is authenticated</h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {getUserName(user)}</p>
              <p><strong>Role:</strong> {getUserRole(user)}</p>
              <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
            </div>
            <button
              onClick={logout}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">❌ User is not authenticated</h2>
            <p className="text-gray-600 mb-4">Please log in to test the authentication.</p>
            <a
              href="/auth/login"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

