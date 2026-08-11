'use client'
import { useState } from 'react'
import Image from 'next/image'
import { updateBusinessSettings } from '@/lib/actions/admin/settingsActions'

export function LogoUploadSection({ currentLogoUrl }: { currentLogoUrl?: string | null }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentLogoUrl ?? null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setError('Please upload a PNG, JPG, WebP or SVG file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File must be under 2MB.')
      return
    }
    setUploading(true)
    setError('')
    setSuccess(false)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'revive-brand')
      form.append('path', `logo-${Date.now()}`)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok || !data.url) { setError(data.error ?? 'Upload failed.'); return }
      const result = await updateBusinessSettings({ logo_url: data.url })
      if (!result.success) { setError(result.error); return }
      setPreview(data.url)
      setSuccess(true)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="border border-white/[0.08] p-6 mb-6">
      <h2 className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.15em] uppercase text-[#6b7280] mb-5">Brand Logo</h2>
      <div className="flex items-center gap-6 mb-5">
        <div className="relative w-[130px] h-[52px] bg-white border border-white/20 flex items-center justify-center">
          {preview ? (
            <Image src={preview} alt="Logo preview" fill className="object-contain p-1" unoptimized />
          ) : (
            <Image src="/images/rfc-logo-dark.png" alt="Logo" fill className="object-contain p-1" />
          )}
        </div>
        <div>
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] font-semibold mb-1">Current Logo</p>
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] leading-relaxed">PNG, JPG, WebP or SVG · Max 2MB<br/>Recommended: 400 × 160px</p>
        </div>
      </div>
      <label className={`inline-flex items-center gap-2 cursor-pointer font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase px-5 py-2.5 border transition-colors ${
        uploading ? 'border-white/[0.08] text-[#6b7280] cursor-not-allowed' : 'border-[#ff571a]/50 text-[#ff571a] hover:border-[#ff571a] hover:bg-[#ff571a]/5'
      }`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
        {uploading ? 'Uploading...' : 'Upload New Logo'}
        <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleFileChange} disabled={uploading} />
      </label>
      {error && <p className="mt-3 text-xs text-red-400 font-[family-name:var(--font-inter)]">{error}</p>}
      {success && <p className="mt-3 text-xs text-emerald-400 font-[family-name:var(--font-inter)]">✓ Logo updated. Refresh the site to see changes.</p>}
    </section>
  )
}
