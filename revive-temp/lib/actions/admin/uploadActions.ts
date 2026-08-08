'use server'

import { createClient } from '@/lib/supabase/server'

export type UploadResult =
  | { success: true; path: string; url: string }
  | { success: false; error: string }

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function uploadImage(
  formData: FormData,
  bucket: string,
  folder: string
): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File | null
    if (!file) return { success: false, error: 'No file provided.' }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' }
    }

    if (file.size > MAX_SIZE_BYTES) {
      return { success: false, error: 'File too large. Maximum size is 5MB.' }
    }

    const supabase = await createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('[uploadImage]', uploadError.message)
      return { success: false, error: 'Failed to upload image.' }
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename)

    return { success: true, path: filename, url: urlData.publicUrl }
  } catch {
    return { success: false, error: 'Upload failed. Please try again.' }
  }
}
