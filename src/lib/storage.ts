import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export async function uploadImage(
  file: File, 
  bucket: string = 'images',
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    // Check if user is authenticated - try multiple approaches
    let currentUser = null
    let session = null
    
    try {
      // First try to get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (!userError && user) {
        currentUser = user
        console.log('User found via getUser:', user.id)
      }
    } catch (error) {
      console.log('getUser failed, trying session...')
    }
    
    // If no user, try to get session
    if (!currentUser) {
      try {
        const { data: { session: sessionData }, error: sessionError } = await supabase.auth.getSession()
        if (!sessionError && sessionData) {
          session = sessionData
          if (sessionData.user) {
            currentUser = sessionData.user
            console.log('User found via session:', sessionData.user.id)
          }
        }
      } catch (error) {
        console.log('getSession failed')
      }
    }
    
    // If still no user, try to refresh the session
    if (!currentUser && session?.refresh_token) {
      try {
        const { data: { session: refreshSession }, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: session.refresh_token
        })
        if (!refreshError && refreshSession?.user) {
          currentUser = refreshSession.user
          session = refreshSession
          console.log('User found via refresh:', refreshSession.user.id)
        } else if (refreshError) {
          console.log('refreshSession failed', refreshError.message)
        }
      } catch (error) {
        console.log('refreshSession failed')
      }
    }
    
    if (!currentUser) {
      throw new Error('No active user session found. Please log in again.')
    }
    
    console.log('User authenticated for upload:', currentUser.id)

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
