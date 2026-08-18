'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTrainer, updateTrainer, deleteTrainer } from '@/lib/actions/admin/contentActions'
import { Toast } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { Trainer } from '@/types/database'
import Link from 'next/link'

interface TrainerFormProps {
  mode: 'create' | 'edit'
  trainer?: Trainer & {
    image_desktop_path?: string | null
    image_tablet_path?: string | null
    image_mobile_path?: string | null
  }
}

type DeviceSlot = 'desktop' | 'tablet' | 'mobile'

const DEVICE_CONFIG: Record<DeviceSlot, { label: string; note: string; icon: string }> = {
  desktop: {
    label: 'Desktop Image',
    note: 'Recommended: 1200 × 720 px (landscape 5:3). Shown in the wide editorial trainer card on screens ≥ 1024 px (card height ≈ 360 px, image spans ~58 vw).',
    icon: '🖥️',
  },
  tablet: {
    label: 'Tablet Image',
    note: 'Recommended: 800 × 600 px (landscape 4:3). Displayed on screens 768 px – 1023 px.',
    icon: '📱',
  },
  mobile: {
    label: 'Mobile Image',
    note: 'Recommended: 400 × 400 px (square 1:1). Shown in compact horizontal card on screens < 768 px (image column ≈ 110 – 140 px wide, min height 140 px).',
    icon: '📲',
  },
}

export function TrainerForm({ mode, trainer }: TrainerFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<DeviceSlot | 'main' | null>(null)
  const [showArchive, setShowArchive] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [name, setName] = useState(trainer?.name ?? '')
  const [slug, setSlug] = useState(trainer?.slug ?? '')
  const [role, setRole] = useState(trainer?.role ?? '')
  const [shortBio, setShortBio] = useState(trainer?.short_bio ?? '')
  const [bio, setBio] = useState(trainer?.bio ?? '')
  const [specialties, setSpecialties] = useState((trainer?.specialties ?? []).join(', '))
  const [yearsExp, setYearsExp] = useState(String(trainer?.years_experience ?? ''))
  const [isActive, setIsActive] = useState(trainer?.is_active ?? true)
  const [isFeatured, setIsFeatured] = useState(trainer?.is_featured ?? false)
  const [sortOrder, setSortOrder] = useState(String(trainer?.sort_order ?? 0))

  // Main profile image
  const [imagePath, setImagePath] = useState(trainer?.profile_image_path ?? '')
  const [imagePreview, setImagePreview] = useState(trainer?.profile_image_path ?? '')

  // Responsive images
  const [desktopPath, setDesktopPath] = useState(trainer?.image_desktop_path ?? '')
  const [desktopPreview, setDesktopPreview] = useState(trainer?.image_desktop_path ?? '')
  const [tabletPath, setTabletPath] = useState(trainer?.image_tablet_path ?? '')
  const [tabletPreview, setTabletPreview] = useState(trainer?.image_tablet_path ?? '')
  const [mobilePath, setMobilePath] = useState(trainer?.image_mobile_path ?? '')
  const [mobilePreview, setMobilePreview] = useState(trainer?.image_mobile_path ?? '')

  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleNameChange = (v: string) => {
    setName(v)
    if (mode === 'create') setSlug(autoSlug(v))
  }

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading('main')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'revive-trainers')
      fd.append('folder', trainer?.id ?? 'new')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setImagePath(data.path)
      setImagePreview(data.url)
      setToast({ message: 'Profile image uploaded.', type: 'success' })
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Upload failed. Please try again.', type: 'error' })
    } finally {
      setUploading(null)
    }
  }

  const handleDeviceUpload = async (device: DeviceSlot, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(device)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'revive-trainers')
      fd.append('folder', `${trainer?.id ?? 'new'}-${device}`)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      if (device === 'desktop') { setDesktopPath(data.path); setDesktopPreview(data.url) }
      if (device === 'tablet')  { setTabletPath(data.path);  setTabletPreview(data.url) }
      if (device === 'mobile')  { setMobilePath(data.path);  setMobilePreview(data.url) }
      setToast({ message: `${DEVICE_CONFIG[device].label} uploaded.`, type: 'success' })
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Upload failed. Please try again.', type: 'error' })
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim() || !role.trim()) return
    setSaving(true)
    const input = {
      name: name.trim(), slug: slug.trim(), role: role.trim(),
      short_bio: shortBio.trim() || null,
      bio: bio.trim() || null,
      specialties: specialties ? specialties.split(',').map((s: string) => s.trim()).filter(Boolean) : null,
      years_experience: yearsExp ? parseInt(yearsExp) : null,
      profile_image_path: imagePath || null,
      image_desktop_path: desktopPath || null,
      image_tablet_path: tabletPath || null,
      image_mobile_path: mobilePath || null,
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

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-body)] placeholder:text-[#4b5563]'
  const lc = 'block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={showArchive} title="Archive this trainer?" description="The trainer will be deactivated but historical data is preserved." confirmLabel="Archive" destructive onConfirm={handleArchive} onCancel={() => setShowArchive(false)} />

      {/* ── Basic Information ── */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Basic Information</h3>
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

      {/* ── Profile Image (main fallback) ── */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-3">
        <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Profile Image</h3>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563] leading-relaxed">
          Primary image used everywhere — full-width background on the trainer detail page (100 vw) and square thumbnail in the listing card (220 × 220 px). Recommended: <strong className="text-[#9ca3af]">1200 × 900 px minimum</strong>. Square or near-square images crop best.
        </p>
        {imagePreview && <img src={imagePreview} alt="Preview" className="w-28 h-28 object-cover border border-white/[0.08]" />}
        <label className="flex flex-col gap-1.5">
          <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Upload (JPEG / PNG / WebP, max 5 MB)</span>
          <input type="file" accept="image/*" onChange={handleMainUpload} disabled={!!uploading} className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#ff571a] file:text-black file:font-bold file:text-xs file:uppercase file:tracking-wider hover:file:bg-white file:transition-colors" />
          {uploading === 'main' && <span className="font-[family-name:var(--font-body)] text-xs text-[#ff571a]">Uploading…</span>}
        </label>
      </div>

      {/* ── Responsive Device Images ── */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-5">
        <div>
          <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Responsive Device Images</h3>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563] mt-1 leading-relaxed">
            Upload separate crops optimised for each screen size. Falls back to the Profile Image above if left empty.
          </p>
        </div>

        {(Object.entries(DEVICE_CONFIG) as [DeviceSlot, (typeof DEVICE_CONFIG)[DeviceSlot]][]).map(([device, cfg]) => {
          const preview = device === 'desktop' ? desktopPreview : device === 'tablet' ? tabletPreview : mobilePreview
          const isUp = uploading === device
          return (
            <div key={device} className="border border-white/[0.05] p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{cfg.icon}</span>
                <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#e2e3e1]">{cfg.label}</span>
              </div>

              {/* Size note */}
              <div className="flex items-start gap-2 bg-[#ff571a]/5 border border-[#ff571a]/15 px-3 py-2">
                <svg className="w-3.5 h-3.5 text-[#ff571a] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af] leading-relaxed">{cfg.note}</p>
              </div>

              {/* Preview */}
              {preview && <img src={preview} alt={`${cfg.label} preview`} className="h-24 w-auto object-cover border border-white/[0.08]" />}

              {/* Upload input */}
              <label className="flex flex-col gap-1.5">
                <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Upload (JPEG / PNG / WebP, max 5 MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleDeviceUpload(device, e)}
                  disabled={!!uploading}
                  className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#1a1f1e] file:text-[#e2e3e1] file:font-bold file:text-xs file:uppercase file:tracking-wider hover:file:bg-[#ff571a] hover:file:text-black file:transition-colors file:border file:border-white/10"
                />
                {isUp && <span className="font-[family-name:var(--font-body)] text-xs text-[#ff571a]">Uploading…</span>}
              </label>
            </div>
          )
        })}
      </div>

      {/* ── Settings ── */}
      <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Active</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Featured</span></label>
          <div><label className={lc}>Sort Order</label><input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" className={ic} /></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>{mode === 'edit' && <button type="button" onClick={() => setShowArchive(true)} className="border border-red-500/20 text-red-400 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-500/10 transition-colors">Archive</button>}</div>
        <div className="flex gap-3">
          <Link href="/admin/trainers" className="border border-white/[0.08] text-[#6b7280] font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:border-white/20 hover:text-[#9ca3af] transition-colors">Cancel</Link>
          <button type="submit" disabled={saving || !!uploading} className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">{saving ? 'Saving…' : mode === 'create' ? 'Create Trainer' : 'Save Changes'}</button>
        </div>
      </div>
    </form>
  )
}
