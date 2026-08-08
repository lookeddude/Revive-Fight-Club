'use client'

import { useState } from 'react'
import { createFacility, updateFacility } from '@/lib/actions/admin/contentActions'
import { uploadImage } from '@/lib/actions/admin/uploadActions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Toast } from '@/components/admin/Toast'
import type { Facility } from '@/types/database'

export function FacilitiesManager({ facilities }: { facilities: Facility[] }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<Facility | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imagePath, setImagePath] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [sortOrder, setSortOrder] = useState('0')

  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const resetForm = () => { setName(''); setSlug(''); setDescription(''); setImagePath(''); setImagePreview(''); setIsActive(true); setIsFeatured(false); setSortOrder('0') }

  const handleEdit = (f: Facility) => {
    setEditItem(f); setName(f.name); setSlug(f.slug); setDescription(f.description ?? '')
    setImagePath(f.image_path ?? ''); setImagePreview(f.image_path ?? '')
    setIsActive(f.is_active); setIsFeatured(f.is_featured); setSortOrder(String(f.sort_order)); setShowAdd(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const result = await uploadImage(fd, 'revive-facilities', editItem?.id ?? 'new')
    setUploading(false)
    if (result.success) { setImagePath(result.path); setImagePreview(result.url); setToast({ message: 'Image uploaded.', type: 'success' }) }
    else setToast({ message: result.error, type: 'error' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const input = { name: name.trim(), slug: slug.trim(), description: description.trim() || null, image_path: imagePath || null, is_active: isActive, is_featured: isFeatured, sort_order: parseInt(sortOrder) || 0 }
    const result = editItem ? await updateFacility(editItem.id, input) : await createFacility(input)
    setSaving(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
    if (result.success) { resetForm(); setShowAdd(false); setEditItem(null) }
  }

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] placeholder:text-[#4b5563]'
  const lc = 'block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-end">
        <button onClick={() => { if (showAdd) { setShowAdd(false); setEditItem(null); resetForm() } else setShowAdd(true) }}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">
          {showAdd ? 'Cancel' : '+ New Facility'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{editItem ? 'Edit Facility' : 'New Facility'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={lc}>Name *</label><input value={name} onChange={e => { setName(e.target.value); if (!editItem) setSlug(autoSlug(e.target.value)) }} required className={ic} /></div>
            <div><label className={lc}>Slug *</label><input value={slug} onChange={e => setSlug(e.target.value)} required className={`${ic} font-mono`} /></div>
          </div>
          <div><label className={lc}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`${ic} resize-none`} /></div>
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover border border-white/[0.08]" />}
          <div>
            <label className="flex flex-col gap-1.5">
              <span className={lc}>Image</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="font-[family-name:var(--font-inter)] text-xs text-[#9ca3af] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:bg-[#ff571a] file:text-black file:font-bold file:text-xs file:uppercase file:tracking-wider hover:file:bg-white file:transition-colors" />
              {uploading && <span className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">Uploading…</span>}
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Active</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Featured</span></label>
            <div><label className={lc}>Sort Order</label><input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" className={ic} /></div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving || uploading} className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}

      {facilities.length > 0 && (
        <div className="bg-[#111312] border border-white/[0.08] overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">{['Name', 'Slug', 'Status', 'Featured', ''].map(h => <th key={h} className="px-4 py-3 text-left font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">{h}</th>)}</tr></thead>
            <tbody>
              {facilities.map(f => (
                <tr key={f.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-sm font-medium text-[#e2e3e1]">{f.name}</td>
                  <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-xs font-mono text-[#6b7280]">{f.slug}</td>
                  <td className="px-4 py-3"><StatusBadge status={f.is_active ? 'active' : 'inactive'} /></td>
                  <td className="px-4 py-3">{f.is_featured && <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#ff571a] border border-[#ff571a]/30 px-2 py-0.5">Featured</span>}</td>
                  <td className="px-4 py-3"><button onClick={() => handleEdit(f)} className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
