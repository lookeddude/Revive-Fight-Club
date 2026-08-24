import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth/getAdminSession'
import { rateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

// Allow large video uploads (default Next.js limit is ~1MB)
export const runtime = 'nodejs'
export const maxDuration = 60 // seconds

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50 MB
const BUCKET = 'revive-videos'
const FOLDER = 'homepage'

/**
 * POST — Upload a video file to Supabase Storage (revive-videos bucket).
 */
export async function POST(request: NextRequest) {
  try {
    const profile = await getAdminSession()
    if (!profile) {
      return NextResponse.json({ error: 'Not authorised.' }, { status: 403 })
    }

    // Rate limiting (keyed by admin user ID)
    const rl = await rateLimit(profile.id, RATE_LIMITS.ADMIN_VIDEO)
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfterSeconds)
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use MP4, WebM, or MOV.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum video size is 50 MB.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp4'
    const filename = `${FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, bytes, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('[/api/admin/upload-video]', uploadError.message)
      return NextResponse.json({ error: `Storage error: ${uploadError.message}` }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl, path: filename })
  } catch (err) {
    console.error('[/api/admin/upload-video] unexpected error:', err)
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 })
  }
}

/**
 * DELETE — Remove a video file from Supabase Storage.
 * Expects JSON body: { path: "homepage/xxxx.mp4" }
 */
export async function DELETE(request: NextRequest) {
  try {
    const profile = await getAdminSession()
    if (!profile) {
      return NextResponse.json({ error: 'Not authorised.' }, { status: 403 })
    }

    const body = await request.json()
    const storagePath = body.path as string | undefined

    if (!storagePath) {
      return NextResponse.json({ error: 'Missing storage path.' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.storage.from(BUCKET).remove([storagePath])

    if (error) {
      console.error('[/api/admin/upload-video] delete error:', error.message)
      return NextResponse.json({ error: `Delete failed: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/admin/upload-video] delete unexpected error:', err)
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 })
  }
}