'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TestRouterPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Ready')

  const testRouter = () => {
    setStatus('Testing router...')
    console.log('🧪 Testing router navigation...')
    
    // Test a simple navigation
    router.push('/')
    
    setStatus('Router test completed - check if you were redirected to home page')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Router Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Next.js Router</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              This page tests if the Next.js router is working properly.
            </p>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Status:</p>
              <p className="text-lg text-blue-600">{status}</p>
            </div>
            
            <button
              onClick={testRouter}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Test Router Navigation
            </button>
            
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Click the "Test Router Navigation" button</li>
                <li>You should be redirected to the home page</li>
                <li>If you stay on this page, there's a router issue</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

