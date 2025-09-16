'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DebugUserPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication State</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Loading:</p>
              <p className="text-lg">{loading ? 'Yes' : 'No'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">User exists:</p>
              <p className="text-lg">{user ? 'Yes' : 'No'}</p>
            </div>
            
            {user && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-600">User ID:</p>
                  <p className="text-lg font-mono">{user.id}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Email:</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">User Metadata:</p>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                    {JSON.stringify(user.user_metadata, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Role:</p>
                  <p className="text-lg font-bold text-blue-600">
                    {user.user_metadata?.role || 'No role set (defaults to user)'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Full User Object:</p>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Login
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard/user')}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Go to User Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
