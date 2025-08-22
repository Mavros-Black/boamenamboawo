'use client'

import { useState } from 'react'

export default function TestUploadResult() {
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testUpload = async () => {
    setLoading(true)
    try {
      // Create a test file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      
      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('bucket', 'images')
      formData.append('folder', 'test')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      setUploadResult(result)
      
      console.log('Upload test result:', result)
    } catch (error) {
      console.error('Upload test error:', error)
      setUploadResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload API Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Upload</h2>
          <button
            onClick={testUpload}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Upload API'}
          </button>
        </div>

        {uploadResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
            
            {uploadResult.url && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">URL Analysis:</h3>
                <ul className="space-y-1 text-sm">
                  <li>URL: {uploadResult.url}</li>
                  <li>Is Supabase: {uploadResult.url.includes('supabase.co') ? '✅ Yes' : '❌ No'}</li>
                  <li>Is Placeholder: {uploadResult.url.includes('picsum.photos') ? '✅ Yes' : '❌ No'}</li>
                  <li>Is Mock: {uploadResult.message?.includes('Mock') ? '✅ Yes' : '❌ No'}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Test Upload API" to see what URL the upload returns</li>
            <li>Check if it's a Supabase storage URL or a placeholder</li>
            <li>If it's a placeholder, the admin upload isn't working</li>
            <li>If it's Supabase, the issue is in the blog form saving</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
