import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated. Please log in again.' }, { status: 401 })
    }

    // 2. Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'revive-gallery'
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, AVIF, or GIF.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10 MB.' }, { status: 400 })
    }

    // 3. Upload to Supabase Storage
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, bytes, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('[/api/admin/upload]', uploadError.message)
      return NextResponse.json({ error: `Storage error: ${uploadError.message}` }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl, path: filename })
  } catch (err) {
    console.error('[/api/admin/upload] unexpected error:', err)
    return NextResponse.json({ error: 'Upload failed unexpectedly. Please try again.' }, { status: 500 })
  }
}
