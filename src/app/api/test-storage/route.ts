import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        error: 'Supabase not configured',
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
        }
      }, { status: 500 })
    }

    // Test 1: List buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    // Test 2: Check if images bucket exists
    const imagesBucket = buckets?.find(b => b.name === 'images')
    
    // Test 3: Try to list files in images bucket
    let files = []
    let filesError = null
    if (imagesBucket) {
      const { data: filesData, error: filesErr } = await supabase.storage
        .from('images')
        .list('', { limit: 10 })
      files = filesData || []
      filesError = filesErr
    }

    return NextResponse.json({
      success: true,
      supabaseConfigured: !!supabase,
      storageAvailable: !!supabase?.storage,
      buckets: buckets?.map(b => ({ name: b.name, public: b.public })),
      imagesBucket: imagesBucket ? {
        name: imagesBucket.name,
        public: imagesBucket.public,
        fileSizeLimit: imagesBucket.file_size_limit,
        allowedMimeTypes: imagesBucket.allowed_mime_types
      } : null,
      files: files.map(f => ({ name: f.name, size: f.metadata?.size })),
      errors: {
        bucketError: bucketError?.message,
        filesError: filesError?.message
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Storage test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
