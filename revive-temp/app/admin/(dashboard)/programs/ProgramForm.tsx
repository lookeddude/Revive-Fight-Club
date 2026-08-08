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
      setToast({ message: 'Image uploaded.', type: 'success' })
    } else {
      setToast({ message: result.error, type: 'error' })
    }
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
    }
    const result = mode === 'create' ? await createProgram(input) : await updateProgram(program!.id, input)
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
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Basic Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Name *</label>
            <input value={name} onChange={e => handleNameChange(e.target.value)} required className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)]" placeholder="e.g. Mixed Martial Arts" />
          </div>
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Slug *</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} required className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] font-mono" placeholder="e.g. mma" />
          </div>
        </div>

        <div>
          <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Short Description</label>
          <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={2} className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] resize-none" placeholder="Brief 1-2 line description" />
        </div>

        <div>
          <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Full Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] resize-none" placeholder="Detailed program description" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)]" placeholder="e.g. Combat Sports" />
          </div>
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Level</label>
            <select value={level} onChange={e => setLevel(e.target.value as typeof level)} className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)]">
              {LEVELS.map(l => <option key={l} value={l}>{l.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Duration (minutes)</label>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)]" placeholder="60" />
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-3">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Image</h3>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-40 object-cover border border-white/[0.08]" />
        )}
        <label className="flex flex-col gap-1.5">
          <span className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">Upload image (JPEG/PNG/WebP, max 5MB)</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="font-[family-name:var(--font-inter)] text-xs text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#ff571a] file:text-black file:font-bold file:text-xs file:uppercase file:tracking-wider hover:file:bg-white file:transition-colors" />
          {uploading && <span className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">Uploading…</span>}
        </label>
      </div>

      {/* Settings */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" />
            <span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Active (visible on site)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" />
            <span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Featured (shown on homepage)</span>
          </label>
          <div>
            <label className="block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Sort Order</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" className="bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)]" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div>
          {mode === 'edit' && (
            <button type="button" onClick={() => setShowArchive(true)} className="border border-red-500/20 text-red-400 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-500/10 transition-colors">
              Archive Program
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/admin/programs" className="border border-white/[0.08] text-[#6b7280] font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:border-white/20 hover:text-[#9ca3af] transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving || uploading} className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : mode === 'create' ? 'Create Program' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
