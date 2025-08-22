import { NextRequest, NextResponse } from 'next/server'
import { uploadImageAdmin } from '@/lib/storage-admin'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({
        error: 'No file provided'
      }, { status: 400 })
    }

    console.log('Testing admin upload with file:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Test admin upload
    const result = await uploadImageAdmin(file, 'images', 'test')

    console.log('Admin upload test result:', result)

    return NextResponse.json({
      success: !result.error,
      result: result,
      message: result.error ? 'Admin upload failed' : 'Admin upload successful'
    })

  } catch (error) {
    console.error('Admin upload test error:', error)
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY),
      serviceRoleKeyLength: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)?.length || 0
    }

    return NextResponse.json({
      message: 'Admin upload test endpoint',
      environment: envCheck,
      instructions: [
        'Use POST with a file to test admin upload',
        'Use GET to check environment variables'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Environment check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
