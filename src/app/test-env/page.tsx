'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestEnvPage() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null)

  const checkEnvironment = () => {
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      bothSet: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }

    setEnvStatus(envVars)
    setSupabaseStatus({
      supabaseExists: !!supabase,
      supabaseType: typeof supabase,
      supabaseUrl: supabase?.supabaseUrl,
      supabaseKey: supabase?.supabaseKey ? 'Set' : 'Not set'
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={checkEnvironment}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Check Environment Variables
        </button>

        {envStatus && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold mb-2">Environment Variables:</h2>
            <div className="space-y-2">
              <p><strong>SUPABASE_URL:</strong> {envStatus.hasUrl ? '✅ Set' : '❌ Not set'}</p>
              <p><strong>SUPABASE_ANON_KEY:</strong> {envStatus.hasKey ? '✅ Set' : '❌ Not set'}</p>
              <p><strong>Both Set:</strong> {envStatus.bothSet ? '✅ Yes' : '❌ No'}</p>
              {envStatus.NEXT_PUBLIC_SUPABASE_URL && (
                <p><strong>URL Value:</strong> {envStatus.NEXT_PUBLIC_SUPABASE_URL.substring(0, 50)}...</p>
              )}
              {envStatus.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
                <p><strong>Key Value:</strong> {envStatus.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...</p>
              )}
            </div>
          </div>
        )}

        {supabaseStatus && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold mb-2">Supabase Client:</h2>
            <div className="space-y-2">
              <p><strong>Client Exists:</strong> {supabaseStatus.supabaseExists ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Client Type:</strong> {supabaseStatus.supabaseType}</p>
              <p><strong>Client URL:</strong> {supabaseStatus.supabaseUrl || 'Not available'}</p>
              <p><strong>Client Key:</strong> {supabaseStatus.supabaseKey}</p>
            </div>
          </div>
        )}

        <div className="bg-yellow-100 p-4 rounded-md">
          <h2 className="font-bold mb-2">Setup Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create a <code>.env.local</code> file in your project root</li>
            <li>Add your Supabase URL: <code>NEXT_PUBLIC_SUPABASE_URL=your_url</code></li>
            <li>Add your Supabase anon key: <code>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key</code></li>
            <li>Restart your development server</li>
            <li>Check this page again</li>
          </ol>
        </div>

        <div className="bg-red-100 p-4 rounded-md">
          <h2 className="font-bold mb-2">Common Issues:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Environment variables not set in <code>.env.local</code></li>
            <li>Development server not restarted after adding env vars</li>
            <li>Wrong variable names (must start with NEXT_PUBLIC_)</li>
            <li>Missing or incorrect Supabase credentials</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
