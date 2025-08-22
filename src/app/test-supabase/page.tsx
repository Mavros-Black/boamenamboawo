'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState('')

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      setStatus('Testing Supabase connection...')
      
      // Check if environment variables are set
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        setError('Missing Supabase environment variables!')
        setStatus('Failed')
        return
      }

      // Test the connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setError(`Supabase error: ${error.message}`)
        setStatus('Failed')
        return
      }

      setStatus('Supabase connection successful!')
      console.log('Supabase session:', data.session)
      
    } catch (err) {
      setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setStatus('Failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Supabase Connection Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection Status</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <p className={`text-lg ${status.includes('successful') ? 'text-green-600' : status.includes('Failed') ? 'text-red-600' : 'text-blue-600'}`}>
                {status}
              </p>
            </div>
            
            {error && (
              <div>
                <p className="text-sm font-medium text-gray-700">Error:</p>
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-700">Environment Variables:</p>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
                <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={testSupabaseConnection}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  )
}

