import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export async function uploadImageSimple(
  file: File, 
  bucket: string = 'images',
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error('Supabase not configured - check environment variables')
      console.error('Environment variables:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      })
      throw new Error('Supabase not configured. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
    }

    // Additional check for Supabase client methods
    if (!supabase.storage) {
      console.error('Supabase storage not available')
      throw new Error('Supabase storage is not available. Please check your Supabase configuration.')
    }

    console.log('Starting simple upload without auth check...')
    console.log('Supabase client available:', !!supabase)
    console.log('Supabase storage available:', !!supabase.storage)
    console.log('Environment variables:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    console.log('Uploading file to path:', filePath)
    console.log('Target bucket:', bucket)

    // Check if bucket exists first
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    console.log('Available buckets:', buckets?.map(b => b.name))
    
    if (bucketError) {
      console.error('Error listing buckets:', bucketError)
    }

    // Upload to Supabase Storage without auth check
    console.log('Attempting upload to bucket:', bucket, 'path:', filePath)
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    console.log('Upload successful, data:', data)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log('Public URL generated:', urlData.publicUrl)

    return {
      url: urlData.publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Image upload error:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

export async function deleteImage(
  path: string, 
  bucket: string = 'images'
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Storage delete error:', error)
      throw new Error(`Delete failed: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Image delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

export function getImageUrl(path: string, bucket: string = 'images'): string {
  if (!supabase) {
    return ''
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}
