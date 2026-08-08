'use client'

import { useState } from 'react'
import { createGalleryItem, deleteGalleryItem } from '@/lib/actions/admin/contentActions'
import { uploadFileToStorage } from '@/lib/upload/client'
import { registerGalleryImageInMediaLibrary } from '@/lib/actions/admin/imageActions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Toast } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { GalleryItem } from '@/types/database'

const CATEGORIES = ['training', 'gym', 'coaches', 'community', 'events']

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('training')
  const [imagePath, setImagePath] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)

  const resetForm = () => { setTitle(''); setDescription(''); setCategory('training'); setImagePath(''); setImagePreview(''); setIsFeatured(false); setIsPublished(true) }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const result = await uploadFileToStorage(file, 'revive-gallery', 'uploads')
    setUploading(false)
    if (result) {
      setImagePath(result.path)
      setImagePreview(result.url)
      setToast({ message: 'Image uploaded & added to media library.', type: 'success' })
      // Register in media_assets so it appears in Image Management picker
      await registerGalleryImageInMediaLibrary(result.url, result.path, file.name, file.type, file.size)
    } else {
      setToast({ message: 'Upload failed. Please try again.', type: 'error' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imagePath) { setToast({ message: 'Please upload an image first.', type: 'error' }); return }
    setSaving(true)
    const result = await createGalleryItem({
      image_path: imagePath, title: title.trim() || null, description: description.trim() || null,
      category: category as GalleryItem['category'], is_featured: isFeatured, is_published: isPublished,
    })
    setSaving(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
    if (result.success) { resetForm(); setShowAdd(false) }
  }

  const handleArchive = async () => {
    if (!archiveTarget) return
    const result = await deleteGalleryItem(archiveTarget)
    setArchiveTarget(null)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
  }

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] placeholder:text-[#4b5563]'
  const lc = 'block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={!!archiveTarget} title="Archive this image?" description="The image will be hidden from the public gallery." confirmLabel="Archive" destructive onConfirm={handleArchive} onCancel={() => setArchiveTarget(null)} />

      <div className="flex items-center justify-between">
        <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563]">
          Images uploaded here are automatically added to the{' '}
          <a href="/admin/images" className="text-[#ff571a] hover:underline">Image Management</a> media library.
        </p>
        <button onClick={() => { if (showAdd) { setShowAdd(false); resetForm() } else setShowAdd(true) }}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors shrink-0">
          {showAdd ? 'Cancel' : '+ Upload Image'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Upload Gallery Image</h3>
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover border border-white/[0.08]" />}
          <div>
            <label className="flex flex-col gap-1.5">
              <span className={lc}>Image * (JPEG/PNG/WebP, max 5MB)</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="font-[family-name:var(--font-inter)] text-xs text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#ff571a] file:text-black file:font-bold file:text-xs file:uppercase file:tracking-wider hover:file:bg-white file:transition-colors" />
              {uploading && <span className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">Uploading…</span>}
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={lc}>Title</label><input value={title} onChange={e => setTitle(e.target.value)} className={ic} placeholder="Optional caption" /></div>
            <div><label className={lc}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={ic}>
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
          </div>
          <div><label className={lc}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={`${ic} resize-none`} /></div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Published</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Featured</span></label>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving || uploading || !imagePath} className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">{saving ? 'Saving…' : 'Save to Gallery'}</button>
          </div>
        </form>
      )}

      {/* Gallery grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const imgUrl = item.image_path.startsWith('http') ? item.image_path : `${supabaseUrl}/storage/v1/object/public/revive-gallery/${item.image_path}`
            return (
              <div key={item.id} className="group relative bg-[#111312] border border-white/[0.08] overflow-hidden">
                <img src={imgUrl} alt={item.title ?? 'Gallery image'} className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => setArchiveTarget(item.id)} className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase text-red-400 hover:text-red-300">Archive</button>
                </div>
                <div className="p-2">
                  {item.title && <p className="font-[family-name:var(--font-inter)] text-xs text-[#9ca3af] truncate">{item.title}</p>}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] capitalize">{item.category}</span>
                    <StatusBadge status={item.is_published ? 'published' : 'draft'} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
