'use client'
import { useState } from 'react'
import { updateBusinessSettings } from '@/lib/actions/admin/settingsActions'

interface VideoUploadSectionProps {
  currentVideoUrl?: string | null
}

/**
 * Admin section for uploading / removing the homepage explainer video.
 * Video is stored in Supabase Storage (revive-videos bucket).
 * URL is saved to business_settings.homepage_video_url.
 */
export function VideoUploadSection({ currentVideoUrl }: VideoUploadSectionProps) {
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentVideoUrl ?? null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)) {
      setError('Please upload an MP4, WebM, or MOV file.')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Video must be under 50 MB.')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/admin/upload-video', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok || !data.url) {
        setError(data.error ?? 'Upload failed.')
        return
      }

      // Save video URL to business_settings
      const result = await updateBusinessSettings({ homepage_video_url: data.url })
      if (!result.success) {
        setError(result.error)
        return
      }

      setPreview(data.url)
      setSuccess('Video uploaded successfully. Refresh the site to see changes.')
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    if (!preview) return
    if (!confirm('Are you sure you want to remove the homepage video?')) return

    setRemoving(true)
    setError('')
    setSuccess('')

    try {
      // Extract storage path from URL for deletion
      const urlParts = preview.split('/revive-videos/')
      const storagePath = urlParts[1] ?? null

      if (storagePath) {
        await fetch('/api/admin/upload-video', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: storagePath }),
        })
      }

      // Clear from business_settings
      const result = await updateBusinessSettings({ homepage_video_url: null })
      if (!result.success) {
        setError(result.error)
        return
      }

      setPreview(null)
      setSuccess('Video removed.')
    } catch {
      setError('Remove failed. Please try again.')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <section className="border border-white/[0.08] p-6 mb-6">
      <h2 className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.15em] uppercase text-[#6b7280] mb-2">
        Homepage Video
      </h2>
      <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563] mb-5 leading-relaxed">
        Upload an explainer video for the homepage. Visible on mobile devices only (16:9 landscape).
      </p>

      {/* Preview */}
      {preview && (
        <div className="mb-5">
          <div className="relative w-full max-w-md aspect-video bg-black border border-white/10 overflow-hidden">
            <video
              src={preview}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            />
          </div>
          <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-2">Current video</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <label
          className={`inline-flex items-center gap-2 cursor-pointer font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase px-5 py-2.5 border transition-colors ${
            uploading
              ? 'border-white/[0.08] text-[#6b7280] cursor-not-allowed'
              : 'border-[#ff571a]/50 text-[#ff571a] hover:border-[#ff571a] hover:bg-[#ff571a]/5'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {uploading ? 'Uploading...' : preview ? 'Replace Video' : 'Upload Video'}
          <input
            type="file"
            className="hidden"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {preview && (
          <button
            onClick={handleRemove}
            disabled={removing}
            className={`inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase px-5 py-2.5 border transition-colors ${
              removing
                ? 'border-white/[0.08] text-[#6b7280] cursor-not-allowed'
                : 'border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/5'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {removing ? 'Removing...' : 'Remove Video'}
          </button>
        )}
      </div>

      <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563] mt-3">
        MP4, WebM or MOV · Max 50 MB · 16:9 landscape recommended
      </p>
      {error && <p className="mt-3 text-xs text-red-400 font-[family-name:var(--font-body)]">{error}</p>}
      {success && <p className="mt-3 text-xs text-emerald-400 font-[family-name:var(--font-body)]">✓ {success}</p>}
    </section>
  )
}
 
