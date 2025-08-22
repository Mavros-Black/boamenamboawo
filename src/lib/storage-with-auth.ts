import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export async function uploadImageWithAuth(
  file: File, 
  bucket: string = 'images',
  folder: string = 'uploads',
  userId?: string
): Promise<UploadResult> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    // If userId is provided, use it directly
    if (userId) {
      console.log('Using provided user ID:', userId)
    } else {
      // Try to get user from session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        throw new Error('No active session found. Please log in again.')
      }
      console.log('Using session user ID:', session.user.id)
    }

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

    console.log('Uploading file to path:', filePath) // Debug log

    // Upload to Supabase Storage
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

    console.log('Upload successful, data:', data) // Debug log

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log('Public URL generated:', urlData.publicUrl) // Debug log

    return {
      url: urlData.publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Image upload error:', error)
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
