'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestStoragePage() {
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testStorage = async () => {
    setUploading(true)
    setError(null)
    setUploadResult(null)

    try {
      // Test if Supabase is configured
      if (!supabase) {
        throw new Error('Supabase not configured')
      }

      // Test storage bucket access
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
      
      if (bucketError) {
        throw new Error(`Bucket list error: ${bucketError.message}`)
      }

      console.log('Available buckets:', buckets)

      // Check if images bucket exists
      const imagesBucket = buckets.find(bucket => bucket.name === 'images')
      
      if (!imagesBucket) {
        throw new Error('Images bucket not found. Please create it in Supabase dashboard.')
      }

      // Test file upload with a simple text file
      const testFile = new File(['Hello World'], 'test.txt', { type: 'text/plain' })
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload('test/test.txt', testFile)

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`)
      }

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl('test/test.txt')

      setUploadResult({
        bucket: imagesBucket,
        upload: uploadData,
        publicUrl: urlData.publicUrl
      })

    } catch (err) {
      console.error('Storage test error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Supabase Storage Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={testStorage}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Testing...' : 'Test Storage'}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {uploadResult && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <h3 className="font-bold">Storage Test Successful!</h3>
            <div className="mt-2 space-y-2">
              <p><strong>Bucket:</strong> {uploadResult.bucket.name}</p>
              <p><strong>Upload Path:</strong> {uploadResult.upload.path}</p>
              <p><strong>Public URL:</strong> <a href={uploadResult.publicUrl} target="_blank" rel="noopener noreferrer" className="underline">{uploadResult.publicUrl}</a></p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Setup Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to your Supabase Dashboard</li>
          <li>Navigate to Storage in the left sidebar</li>
          <li>Create a new bucket named "images"</li>
          <li>Set it as a public bucket</li>
          <li>Set file size limit to 5MB</li>
          <li>Set allowed MIME types to "image/*"</li>
          <li>Run the SQL script in database-schema-update.sql</li>
          <li>Click "Test Storage" above</li>
        </ol>
      </div>
    </div>
  )
}
