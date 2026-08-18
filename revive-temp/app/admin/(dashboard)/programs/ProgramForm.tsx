'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createProgram, updateProgram, deleteProgram } from '@/lib/actions/admin/contentActions'
import { uploadImage } from '@/lib/actions/admin/uploadActions'
import { Toast } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { Program } from '@/types/database'

const LEVELS: Array<'all_levels' | 'beginner' | 'intermediate' | 'advanced'> = ['all_levels', 'beginner', 'intermediate', 'advanced']

interface ProgramFormProps {
  mode: 'create' | 'edit'
  program?: Program
}

export function ProgramForm({ mode, program }: ProgramFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [name, setName] = useState(program?.name ?? '')
  const [slug, setSlug] = useState(program?.slug ?? '')
  const [shortDesc, setShortDesc] = useState(program?.short_description ?? '')
  const [description, setDescription] = useState(program?.description ?? '')
  const [category, setCategory] = useState(program?.category ?? '')
  const [level, setLevel] = useState<'all_levels' | 'beginner' | 'intermediate' | 'advanced'>(program?.level ?? 'all_levels')
  const [duration, setDuration] = useState(String(program?.duration_minutes ?? ''))
  const [imagePath, setImagePath] = useState(program?.image_path ?? '')
  const [imagePreview, setImagePreview] = useState(program?.image_path ?? '')
  const [isActive, setIsActive] = useState(program?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(program?.is_featured ?? false)
  const [sortOrder, setSortOrder] = useState(String(program?.sort_order ?? 0))
  // Gallery images — array of public URLs
  const [galleryImages, setGalleryImages] = useState<string[]>(
    (program as any)?.gallery_images ?? []
  )

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleNameChange = (v: string) => {
    setName(v)
    if (mode === 'create') setSlug(autoSlug(v))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadImage(formData, 'revive-programs', program?.id ?? 'new')
    setUploading(false)
    if (result.success) {
      setImagePath(result.path)
      setImagePreview(result.url)
      setToast({ message: 'Cover image uploaded.', type: 'success' })
    } else {
      setToast({ message: result.error, type: 'error' })
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploadingGallery(true)

    const newUrls: string[] = []
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadImage(
        formData,
        'revive-programs',
        `${program?.id ?? 'new'}-gallery-${Date.now()}-${Math.random().toString(36).slice(2)}`
      )
      if (result.success) {
        newUrls.push(result.url)
      } else {
        setToast({ message: `Failed to upload ${file.name}`, type: 'error' })
      }
    }

    setGalleryImages(prev => [...prev, ...newUrls])
    setUploadingGallery(false)
    if (newUrls.length > 0) {
      setToast({ message: `${newUrls.length} photo(s) added to gallery.`, type: 'success' })
    }
    // Reset input
    e.target.value = ''
  }

  const removeGalleryImage = (url: string) => {
    setGalleryImages(prev => prev.filter(u => u !== url))
  }

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const newArr = [...galleryImages]
    const swap = direction === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= newArr.length) return
    ;[newArr[index], newArr[swap]] = [newArr[swap], newArr[index]]
    setGalleryImages(newArr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return
    setSaving(true)
    const input = {
      name: name.trim(), slug: slug.trim(),
      short_description: shortDesc.trim() || null,
      description: description.trim() || null,
      category: category.trim() || null,
      level: level as Program['level'],
      duration_minutes: duration ? parseInt(duration) : null,
      image_path: imagePath || null,
      is_active: isActive, is_featured: isFeatured,
      sort_order: parseInt(sortOrder) || 0,
      gallery_images: galleryImages,
    }
    const result = mode === 'create' ? await createProgram(input as any) : await updateProgram(program!.id, input as any)
    setSaving(false)
    if (result.success) {
      setToast({ message: result.message, type: 'success' })
      setTimeout(() => router.push('/admin/programs'), 1000)
    } else {
      setToast({ message: result.error, type: 'error' })
    }
  }

  const handleArchive = async () => {
    setShowArchive(false)
    if (!program) return
    const result = await deleteProgram(program.id)
    if (result.success) {
      setToast({ message: result.message, type: 'success' })
      setTimeout(() => router.push('/admin/programs'), 1000)
    } else {
      setToast({ message: result.error, type: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog
        open={showArchive}
        title="Archive this program?"
        description="The program will be deactivated. It won't appear on the public site but historical data is preserved."
        confirmLabel="Archive"
        destructive
        onConfirm={handleArchive}
        onCancel={() => setShowArchive(false)}
      />

      {/* Basic Info */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-3">
        <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Basic Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Name *</label>
            <input value={name} onChange={e => handleNameChange(e.target.value)} required className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:ring-1 focus:ring-[#ff571a] focus:border-[#ff571a] w-full font-[family-name:var(--font-body)]" placeholder="e.g. Mixed Martial Arts" />
          </div>
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Slug *</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} required className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:ring-1 focus:ring-[#ff571a] focus:border-[#ff571a] w-full font-[family-name:var(--font-body)] font-mono" placeholder="e.g. mma" />
          </div>
        </div>

        <div>
          <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Short Description</label>
          <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={2} className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:ring-1 focus:ring-[#ff571a] focus:border-[#ff571a] w-full font-[family-name:var(--font-body)] resize-none" placeholder="Brief 1-2 line description" />
        </div>

        <div>
          <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Full Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:ring-1 focus:ring-[#ff571a] focus:border-[#ff571a] w-full font-[family-name:var(--font-body)] resize-none" placeholder="Detailed program description shown on the program detail page" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:ring-1 focus:ring-[#ff571a] focus:border-[#ff571a] w-full font-[family-name:var(--font-body)]" placeholder="e.g. Combat Sports" />
          </div>
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Level</label>
            <select value={level} onChange={e => setLevel(e.target.value as typeof level)} className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:ring-1 focus:ring-[#ff571a] focus:border-[#ff571a] w-full font-[family-name:var(--font-body)]">
              {LEVELS.map(l => <option key={l} value={l}>{l.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Duration (minutes)</label>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:ring-1 focus:ring-[#ff571a] focus:border-[#ff571a] w-full font-[family-name:var(--font-body)]" placeholder="60" />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-3">
        <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Cover Image</h3>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Main image shown on program cards and as the first slideshow photo.</p>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-40 object-cover border border-white/[0.08]" />
        )}
        <label className="flex flex-col gap-1.5">
          <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Upload image (JPEG/PNG/WebP, max 5MB)</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#ff571a] file:text-black file:font-bold file:text-xs file:uppercase file:tracking-wider hover:file:bg-white file:transition-colors" />
          {uploading && <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Uploading…</span>}
        </label>
      </div>

      {/* Gallery Images — Slideshow */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <div>
          <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
            Photo Gallery — Slideshow
          </h3>
          <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-1">
            Upload multiple photos. They will display as an auto-advancing slideshow on the program detail page. Drag to reorder.
          </p>
        </div>

        {/* Upload multiple */}
        <label className="flex flex-col gap-1.5">
          <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">
            Select multiple photos (hold Ctrl/Cmd to select multiple)
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            disabled={uploadingGallery}
            className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#1e201f] file:text-[#e2e3e1] file:font-bold file:text-xs file:uppercase file:tracking-wider hover:file:bg-[#282a29] file:transition-colors file:border file:border-white/10"
          />
          {uploadingGallery && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-[#ff571a] border-t-transparent rounded-full animate-spin" />
              <span className="font-[family-name:var(--font-body)] text-xs text-[#ff571a]">Uploading photos…</span>
            </div>
          )}
        </label>

        {/* Gallery grid preview */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleryImages.map((url, i) => (
              <div key={url} className="relative group border border-white/[0.08] overflow-hidden">
                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-28 object-cover" />

                {/* Order badge */}
                <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-[#ff571a] flex items-center justify-center">
                  <span className="text-black text-xs font-black">{i + 1}</span>
                </div>

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(i, 'up')}
                      disabled={i === 0}
                      className="w-7 h-7 bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors"
                      title="Move left"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(i, 'down')}
                      disabled={i === galleryImages.length - 1}
                      className="w-7 h-7 bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-colors"
                      title="Move right"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="px-2 py-1 bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-white/10 p-8 text-center">
            <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563]">
              No gallery photos yet. Upload photos above to create a slideshow.
            </p>
          </div>
        )}

        {galleryImages.length > 0 && (
          <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563]">
            {galleryImages.length} photo{galleryImages.length !== 1 ? 's' : ''} · Hover a photo to reorder or remove · First photo shows first in slideshow
          </p>
        )}
      </div>

      {/* Settings */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" />
            <span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Active (visible on site)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" />
            <span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Featured (shown on homepage)</span>
          </label>
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Sort Order</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:ring-1 focus:ring-[#ff571a] focus:border-[#ff571a] w-full font-[family-name:var(--font-body)]" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div>
          {mode === 'edit' && (
            <button type="button" onClick={() => setShowArchive(true)} className="border border-red-500/20 text-red-400 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-500/10 transition-colors">
              Archive Program
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/admin/programs" className="border border-white/[0.08] text-[#6b7280] font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:border-white/20 hover:text-[#9ca3af] transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving || uploading || uploadingGallery} className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : mode === 'create' ? 'Create Program' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
