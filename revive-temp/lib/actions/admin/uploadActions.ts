'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/getAdminSession'

export type UploadResult =
  | { success: true; path: string; url: string }
  | { success: false; error: string }

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export async function uploadImage(
  formData: FormData,
  bucket: string,
  folder: string
): Promise<UploadResult> {
  try {
    const supabase = await createClient()

    // Verify caller is an active staff member (not just any authenticated user)
    await requireAdmin()

    const file = formData.get('file') as File | null
    if (!file) return { success: false, error: 'No file provided.' }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Use JPEG, PNG, WebP, AVIF, or GIF.' }
    }

    if (file.size > MAX_SIZE_BYTES) {
      return { success: false, error: 'File too large. Maximum size is 10MB.' }
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('[uploadImage] Storage error:', uploadError.message)
      return { success: false, error: `Upload failed: ${uploadError.message}` }
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename)

    return { success: true, path: filename, url: urlData.publicUrl }
  } catch (err) {
    console.error('[uploadImage] Unexpected error:', err)
    return { success: false, error: 'Upload failed. Please try again.' }
  }
}
