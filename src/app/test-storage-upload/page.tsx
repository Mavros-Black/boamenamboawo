'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function TestStorageUpload() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setUploadedUrl('')
    addLog(`Starting upload for file: ${file.name} (${file.size} bytes)`)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'images')
      formData.append('folder', 'test')
      if (user?.id) {
        formData.append('userId', user.id)
      }

      addLog(`User ID: ${user?.id || 'Not logged in'}`)
      addLog('Sending upload request to /api/upload...')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      addLog(`Response status: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.json()
        addLog(`Error response: ${JSON.stringify(errorData)}`)
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      addLog(`Upload successful: ${JSON.stringify(result)}`)
      setUploadedUrl(result.url)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      addLog(`Upload failed: ${errorMessage}`)
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Test Storage Upload</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload Test</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select an image file:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {uploading && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
            Uploading...
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {uploadedUrl && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Uploaded Image:</h3>
            <img 
              src={uploadedUrl} 
              alt="Uploaded" 
              className="max-w-md rounded border"
              onError={() => addLog('Failed to load uploaded image')}
            />
            <p className="text-sm text-gray-600 mt-2">URL: {uploadedUrl}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Logs</h2>
        <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Try uploading a file.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you're logged in as an admin user</li>
          <li>Run the <code>setup-storage-bucket.sql</code> script in Supabase SQL Editor</li>
          <li>Select an image file and try uploading</li>
          <li>Check the logs below for detailed information</li>
          <li>If upload fails, check the error message and logs</li>
        </ol>
      </div>
    </div>
  )
}
