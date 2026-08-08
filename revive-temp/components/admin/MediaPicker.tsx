'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { assignImageToSlot, registerGalleryImageInMediaLibrary } from '@/lib/actions/admin/imageActions'
import { uploadFileToStorage } from '@/lib/upload/client'
import type { MediaAsset, ImageSlot } from '@/lib/data/images'

interface MediaPickerProps {
  slot: ImageSlot
  mediaAssets: MediaAsset[]
  onClose: () => void
  onSuccess: (newUrl: string) => void
}

export function MediaPicker({ slot, mediaAssets, onClose, onSuccess }: MediaPickerProps) {
  const [tab, setTab] = useState<'gallery' | 'upload' | 'external'>('gallery')
  const [selected, setSelected] = useState<MediaAsset | null>(null)
  const [externalUrl, setExternalUrl] = useState('')
  const [externalPreview, setExternalPreview] = useState(false)
  const [altText, setAltText] = useState(slot.alt_text ?? '')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = mediaAssets.filter(a =>
    !search || a.file_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const result = await uploadFileToStorage(file, 'revive-gallery', 'media-library')
    setUploading(false)
    if (result) {
      // Register in media_assets table
      await registerGalleryImageInMediaLibrary(result.url, result.path, file.name, file.type, file.size)
      setToast('Uploaded! Now click "Use This Image" to assign.')
      const newAsset: MediaAsset = {
        id: crypto.randomUUID(),
        file_name: file.name,
        storage_bucket: 'revive-gallery',
        storage_path: result.path,
        public_url: result.url,
        mime_type: file.type,
        file_size: file.size,
        alt_text: altText || null,
        created_at: new Date().toISOString(),
        created_by: null,
      }
      setSelected(newAsset)
      setTab('gallery')
    } else {
      setToast('Upload failed. Please try a different image.')
    }
    e.target.value = ''
  }

  const handleSave = useCallback(async () => {
    let url: string | null = null
    let mediaId: string | null = null

    if (tab === 'external') {
      if (!externalUrl.trim()) return
      url = externalUrl.trim()
    } else {
      if (!selected) return
      url = selected.public_url
      mediaId = selected.id
    }

    setSaving(true)
    const res = await assignImageToSlot(slot.slot_key, url, mediaId, altText || null)
    setSaving(false)

    if (res.success) {
      onSuccess(url)
    } else {
      setToast(res.error)
    }
  }, [tab, externalUrl, selected, slot.slot_key, altText, onSuccess])

  const previewUrl = tab === 'external' ? externalUrl : selected?.public_url

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col" style={{ background: '#111312', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div>
            <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-[#f0ede8] uppercase">
              Change Image
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b6059] mt-0.5">
              {slot.section} → {slot.title}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#6b6059] hover:text-[#f0ede8] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left: picker */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs */}
            <div className="flex border-b border-white/[0.08]">
              {[
                { id: 'gallery', label: 'Media Library' },
                { id: 'upload', label: 'Upload New' },
                { id: 'external', label: 'External URL' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`px-5 py-3 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    tab === t.id
                      ? 'text-[#ff571a] border-[#ff571a]'
                      : 'text-[#6b6059] border-transparent hover:text-[#f0ede8]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Gallery Tab */}
              {tab === 'gallery' && (
                <>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search images..."
                    className="w-full bg-[#0d0c0b] border border-white/[0.08] px-3 py-2 text-sm text-[#f0ede8] focus:outline-none focus:border-[#ff571a]/50 mb-4 font-[family-name:var(--font-inter)]"
                  />
                  {filtered.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="font-[family-name:var(--font-inter)] text-sm text-[#4b5563]">
                        No images in media library yet.
                      </p>
                      <button
                        onClick={() => setTab('upload')}
                        className="mt-3 text-[#ff571a] text-xs font-bold uppercase tracking-wider hover:underline"
                      >
                        Upload your first image →
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {filtered.map(asset => (
                        <button
                          key={asset.id}
                          onClick={() => setSelected(asset)}
                          className={`relative aspect-square overflow-hidden transition-all ${
                            selected?.id === asset.id
                              ? 'ring-2 ring-[#ff571a] ring-offset-2 ring-offset-[#111312]'
                              : 'hover:opacity-80'
                          }`}
                        >
                          <img
                            src={asset.public_url}
                            alt={asset.alt_text ?? asset.file_name}
                            className="w-full h-full object-cover"
                          />
                          {selected?.id === asset.id && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-[#ff571a] flex items-center justify-center rounded-full">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Upload Tab */}
              {tab === 'upload' && (
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-white/[0.1] p-12 text-center cursor-pointer hover:border-[#ff571a]/50 transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#ff571a] border-t-transparent rounded-full animate-spin" />
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b6059]">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-[#3a3530] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b6059]">Click to upload</p>
                        <p className="font-[family-name:var(--font-inter)] text-xs text-[#3a3530] mt-1">JPG, PNG, WebP — max 5MB</p>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </div>
              )}

              {/* External URL Tab */}
              {tab === 'external' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Image URL</label>
                    <input
                      value={externalUrl}
                      onChange={e => { setExternalUrl(e.target.value); setExternalPreview(false) }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-[#0d0c0b] border border-white/[0.08] px-3 py-2 text-sm text-[#f0ede8] focus:outline-none focus:border-[#ff571a]/50 font-[family-name:var(--font-inter)]"
                    />
                  </div>
                  <button
                    onClick={() => setExternalPreview(true)}
                    className="text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:underline font-[family-name:var(--font-inter)]"
                  >
                    Preview →
                  </button>
                  {externalPreview && externalUrl && (
                    <div className="relative aspect-video w-full overflow-hidden border border-white/[0.08]">
                      <img src={externalUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#3a3530]">
                    Tip: Use Gallery upload for best performance and control.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: preview + alt text */}
          <div className="w-64 border-l border-white/[0.08] flex flex-col">
            <div className="p-4 border-b border-white/[0.08]">
              <p className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#6b6059] mb-2">Preview</p>
              <div className="aspect-video w-full bg-[#0d0c0b] border border-white/[0.06] overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#3a3530]">No image selected</p>
                  </div>
                )}
              </div>
              {selected && (
                <div className="mt-2">
                  <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b6059] truncate">{selected.file_name}</p>
                  {selected.file_size && (
                    <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#3a3530]">
                      {(selected.file_size / 1024).toFixed(0)} KB
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 flex-1">
              <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Alt Text (SEO)</label>
              <textarea
                value={altText}
                onChange={e => setAltText(e.target.value)}
                rows={3}
                placeholder="Describe the image..."
                className="w-full bg-[#0d0c0b] border border-white/[0.08] px-2 py-1.5 text-xs text-[#f0ede8] focus:outline-none focus:border-[#ff571a]/50 font-[family-name:var(--font-inter)] resize-none"
              />
            </div>

            {/* Toast */}
            {toast && (
              <div className="mx-4 mb-4 px-3 py-2 bg-[#1a1208] border border-[#ff571a]/20 text-xs text-[#ff571a] font-[family-name:var(--font-inter)]">
                {toast}
              </div>
            )}

            {/* Actions */}
            <div className="p-4 border-t border-white/[0.08] flex flex-col gap-2">
              <button
                onClick={handleSave}
                disabled={saving || (!selected && tab !== 'external') || (tab === 'external' && !externalUrl)}
                className="w-full py-2.5 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-40"
              >
                {saving ? 'Publishing...' : 'Use This Image'}
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 border border-white/[0.08] text-[#6b6059] font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider hover:text-[#f0ede8] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
