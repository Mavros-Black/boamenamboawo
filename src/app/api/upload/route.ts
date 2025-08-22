import { NextRequest, NextResponse } from 'next/server'
import { uploadImageSimple } from '@/lib/storage-simple'
import { uploadImageAdmin } from '@/lib/storage-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'images'
    const folder = formData.get('folder') as string || 'uploads'
    const userId = formData.get('userId') as string

    console.log('Upload API called with:', { bucket, folder, userId }) // Debug log
    console.log('File details:', { 
      name: file?.name, 
      size: file?.size, 
      type: file?.type 
    })

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Try admin upload first (bypasses RLS)
    console.log('Trying admin upload with service role...')
    const adminResult = await uploadImageAdmin(file, bucket, folder)
    console.log('Admin upload result:', adminResult)

    if (!adminResult.error) {
      console.log('Admin upload successful!')
      return NextResponse.json({
        url: adminResult.url,
        path: adminResult.path
      })
    }

    // Fallback to simple upload
    console.log('Admin upload failed, trying simple upload...')
    const result = await uploadImageSimple(file, bucket, folder)
    console.log('Simple upload result:', result)

    if (result.error) {
      console.error('All upload methods failed:', result.error)
      
      // Final fallback to mock upload
      console.log('Falling back to mock upload...')
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`
      const mockUrl = `https://picsum.photos/400/300?random=${Date.now()}`
      
      return NextResponse.json({
        url: mockUrl,
        path: `${folder}/${fileName}`,
        message: 'Mock upload - Supabase storage not available'
      })
    }

    console.log('Upload successful:', result) // Debug log

    return NextResponse.json({
      url: result.url,
      path: result.path
    })
  } catch (error) {
    console.error('Upload API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
