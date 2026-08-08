'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTrainer, updateTrainer, deleteTrainer } from '@/lib/actions/admin/contentActions'
import { uploadImage } from '@/lib/actions/admin/uploadActions'
import { Toast } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { Trainer } from '@/types/database'
import Link from 'next/link'

interface TrainerFormProps {
  mode: 'create' | 'edit'
  trainer?: Trainer
}

export function TrainerForm({ mode, trainer }: TrainerFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [name, setName] = useState(trainer?.name ?? '')
  const [slug, setSlug] = useState(trainer?.slug ?? '')
  const [role, setRole] = useState(trainer?.role ?? '')
  const [shortBio, setShortBio] = useState(trainer?.short_bio ?? '')
  const [bio, setBio] = useState(trainer?.bio ?? '')
  const [specialties, setSpecialties] = useState((trainer?.specialties ?? []).join(', '))
  const [yearsExp, setYearsExp] = useState(String(trainer?.years_experience ?? ''))
  const [imagePath, setImagePath] = useState(trainer?.profile_image_path ?? '')
  const [imagePreview, setImagePreview] = useState(trainer?.profile_image_path ?? '')
  const [isActive, setIsActive] = useState(trainer?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(trainer?.is_featured ?? false)
  const [sortOrder, setSortOrder] = useState(String(trainer?.sort_order ?? 0))

  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

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
    const result = await uploadImage(formData, 'revive-trainers', trainer?.id ?? 'new')
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
    if (!name.trim() || !slug.trim() || !role.trim()) return
    setSaving(true)
    const input = {
      name: name.trim(), slug: slug.trim(), role: role.trim(),
      short_bio: shortBio.trim() || null, bio: bio.trim() || null,
      specialties: specialties ? specialties.split(',').map((s: string) => s.trim()).filter(Boolean) : null,
      years_experience: yearsExp ? parseInt(yearsExp) : null,
      profile_image_path: imagePath || null,
      is_active: isActive, is_featured: isFeatured,
      sort_order: parseInt(sortOrder) || 0,
    }
    const result = mode === 'create' ? await createTrainer(input) : await updateTrainer(trainer!.id, input)
    setSaving(false)
    if (result.success) {
      setToast({ message: result.message, type: 'success' })
      setTimeout(() => router.push('/admin/trainers'), 1000)
    } else {
      setToast({ message: result.error, type: 'error' })
    }
  }

  const handleArchive = async () => {
    setShowArchive(false)
    if (!trainer) return
    const result = await deleteTrainer(trainer.id)
    if (result.success) {
      setToast({ message: result.message, type: 'success' })
      setTimeout(() => router.push('/admin/trainers'), 1000)
    } else {
      setToast({ message: result.error, type: 'error' })
    }
  }

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] placeholder:text-[#4b5563]'
  const lc = 'block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={showArchive} title="Archive this trainer?" description="The trainer will be deactivated but historical data is preserved." confirmLabel="Archive" destructive onConfirm={handleArchive} onCancel={() => setShowArchive(false)} />

      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={lc}>Name *</label><input value={name} onChange={e => handleNameChange(e.target.value)} required className={ic} placeholder="e.g. John Silva" /></div>
          <div><label className={lc}>Slug *</label><input value={slug} onChange={e => setSlug(e.target.value)} required className={`${ic} font-mono`} placeholder="e.g. john-silva" /></div>
        </div>
        <div><label className={lc}>Role / Title *</label><input value={role} onChange={e => setRole(e.target.value)} required className={ic} placeholder="e.g. Head MMA Coach" /></div>
        <div><label className={lc}>Specialties (comma-separated)</label><input value={specialties} onChange={e => setSpecialties(e.target.value)} className={ic} placeholder="e.g. MMA, Muay Thai, Wrestling" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={lc}>Years of Experience</label><input type="number" value={yearsExp} onChange={e => setYearsExp(e.target.value)} min="0" className={ic} placeholder="10" /></div>
        </div>
        <div><label className={lc}>Short Bio (1-2 lines)</label><textarea value={shortBio} onChange={e => setShortBio(e.target.value)} rows={2} className={`${ic} resize-none`} placeholder="Brief intro for listings" /></div>
        <div><label className={lc}>Full Bio</label><textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className={`${ic} resize-none`} placeholder="Full bio for trainer profile" /></div>
      </div>

      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-3">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Profile Image</h3>
        {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover border border-white/[0.08]" />}
        <label className="flex flex-col gap-1.5">
          <span className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">Upload (JPEG/PNG/WebP, max 5MB)</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="font-[family-name:var(--font-inter)] text-xs text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#ff571a] file:text-black file:font-bold file:text-xs file:uppercase file:tracking-wider hover:file:bg-white file:transition-colors" />
          {uploading && <span className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">Uploading…</span>}
        </label>
      </div>

      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Active</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Featured</span></label>
          <div><label className={lc}>Sort Order</label><input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" className={ic} /></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>{mode === 'edit' && <button type="button" onClick={() => setShowArchive(true)} className="border border-red-500/20 text-red-400 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-500/10 transition-colors">Archive</button>}</div>
        <div className="flex gap-3">
          <Link href="/admin/trainers" className="border border-white/[0.08] text-[#6b7280] font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:border-white/20 hover:text-[#9ca3af] transition-colors">Cancel</Link>
          <button type="submit" disabled={saving || uploading} className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">{saving ? 'Saving…' : mode === 'create' ? 'Create Trainer' : 'Save Changes'}</button>
        </div>
      </div>
    </form>
  )
}
