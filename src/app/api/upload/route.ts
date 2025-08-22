import { NextRequest, NextResponse } from 'next/server'
import { uploadImageSimple } from '@/lib/storage-simple'

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

    // Upload the image using simple method (no auth check)
    const result = await uploadImageSimple(file, bucket, folder)

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
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
