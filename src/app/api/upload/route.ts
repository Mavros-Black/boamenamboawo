import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'images'
    const folder = formData.get('folder') as string || 'uploads'
    const userId = formData.get('userId') as string

    console.log('Upload API called with:', { bucket, folder, userId }) // Debug log

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload the image with user ID if provided
    const result = await uploadImage(file, bucket, folder)

    if (result.error) {
      console.error('Upload result error:', result.error) // Debug log
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    console.log('Upload successful:', result) // Debug log

    return NextResponse.json({
      url: result.url,
      path: result.path
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
