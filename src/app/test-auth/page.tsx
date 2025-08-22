'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function TestAuthPage() {
  const { user, loading } = useAuth()
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  const checkAuth = async () => {
    try {
      // Check AuthContext user
      console.log('AuthContext user:', user)
      
      // Check Supabase auth directly
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser()
      console.log('Supabase user:', supabaseUser)
      console.log('User error:', userError)
      
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Session:', session)
      console.log('Session error:', sessionError)
      
      setAuthStatus({
        authContextUser: user,
        supabaseUser,
        userError,
        sessionError
      })
      
      setSessionInfo(session)
      
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthStatus({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  useEffect(() => {
    checkAuth()
  }, [user])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={checkAuth}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Check Authentication
        </button>

        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="font-bold mb-2">AuthContext Status:</h2>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
          {user && (
            <div className="mt-2">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.user_metadata?.role || 'No role'}</p>
            </div>
          )}
        </div>

        {authStatus && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold mb-2">Supabase Auth Status:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(authStatus, null, 2)}
            </pre>
          </div>
        )}

        {sessionInfo && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold mb-2">Session Info:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-100 p-4 rounded-md">
          <h2 className="font-bold mb-2">Troubleshooting Steps:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Check if user is logged in via AuthContext</li>
            <li>Verify Supabase session is active</li>
            <li>Ensure user has proper role (admin)</li>
            <li>Check browser console for errors</li>
            <li>Try logging out and back in</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

