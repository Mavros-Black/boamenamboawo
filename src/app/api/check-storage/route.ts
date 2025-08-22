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
      })
    }

    // Test 1: Check if storage is available
    if (!supabase.storage) {
      return NextResponse.json({
        error: 'Supabase storage not available',
        supabaseConfigured: true,
        storageAvailable: false
      })
    }

    // Test 2: List buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      return NextResponse.json({
        error: 'Failed to list buckets',
        bucketError: bucketError.message,
        supabaseConfigured: true,
        storageAvailable: true
      })
    }

    // Test 3: Check if images bucket exists
    const imagesBucket = buckets?.find(b => b.name === 'images')
    
    return NextResponse.json({
      success: true,
      supabaseConfigured: true,
      storageAvailable: true,
      buckets: buckets?.map(b => ({ name: b.name, public: b.public })),
      imagesBucket: imagesBucket ? {
        name: imagesBucket.name,
        public: imagesBucket.public,
        fileSizeLimit: imagesBucket.file_size_limit,
        allowedMimeTypes: imagesBucket.allowed_mime_types
      } : null,
      bucketCount: buckets?.length || 0
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Storage check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
