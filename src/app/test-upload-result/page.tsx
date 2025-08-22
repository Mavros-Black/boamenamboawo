'use client'

import { useState } from 'react'

export default function TestUploadResult() {
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testUpload = async () => {
    setLoading(true)
    try {
      // Create a test image file (1x1 pixel PNG)
      const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      
      // Convert base64 to blob
      const response = await fetch(imageData)
      const blob = await response.blob()
      
      // Create file from blob
      const testFile = new File([blob], 'test-image.png', { type: 'image/png' })
      
      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('bucket', 'images')
      formData.append('folder', 'test')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await uploadResponse.json()
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
            {loading ? 'Testing...' : 'Test Upload API with Image'}
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
            <li>Click "Test Upload API with Image" to test with a real image file</li>
            <li>Check if it returns a Supabase storage URL or a placeholder</li>
            <li>If it's a placeholder, the admin upload isn't working</li>
            <li>If it's Supabase, the issue is in the blog form saving</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-800 mb-2">Note:</h3>
            <p className="text-yellow-700 text-sm">
              This test now uses a real 1x1 pixel PNG image instead of a text file. 
              This should trigger the actual Supabase upload instead of falling back to mock.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
