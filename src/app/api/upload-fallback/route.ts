import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'images'
    const folder = formData.get('folder') as string || 'uploads'

    console.log('Fallback upload API called with:', { bucket, folder })

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate a mock URL for testing
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`
    const mockUrl = `https://via.placeholder.com/400x300/cccccc/666666?text=${encodeURIComponent(fileName)}`

    console.log('Fallback upload successful, mock URL:', mockUrl)

    return NextResponse.json({
      url: mockUrl,
      path: `${folder}/${fileName}`,
      message: 'This is a fallback upload - Supabase not configured'
    })
  } catch (error) {
    console.error('Fallback upload API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
