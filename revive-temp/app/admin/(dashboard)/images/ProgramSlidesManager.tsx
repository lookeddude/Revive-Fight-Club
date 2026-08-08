'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  addProgramSlide,
  deleteProgramSlide,
  toggleProgramSlide,
} from '@/lib/actions/admin/programSlideActions'
import {
  createProgram,
  updateProgram,
  deleteProgram,
} from '@/lib/actions/admin/contentActions'
import { uploadFileToStorage } from '@/lib/upload/client'
import { Toast } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { ProgramWithSlides, ProgramSlide } from '@/lib/data/programSlides'

interface Props {
  initialPrograms: ProgramWithSlides[]
}

type ProgramForm = {
  name: string
  slug: string
  category: string
  level: string
  short_description: string
  duration_minutes: string
}

const emptyForm: ProgramForm = {
  name: '',
  slug: '',
  category: '',
  level: 'all_levels',
  short_description: '',
  duration_minutes: '',
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function ProgramSlidesManager({ initialPrograms }: Props) {
  const [programs, setPrograms] = useState(initialPrograms)
  const [selectedId, setSelectedId] = useState<string>(initialPrograms[0]?.id ?? '')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [deleteSlideTarget, setDeleteSlideTarget] = useState<string | null>(null)
  const [deleteProgramTarget, setDeleteProgramTarget] = useState<string | null>(null)
  const [addTab, setAddTab] = useState<'upload' | 'url'>('upload')
  const [showAddProgram, setShowAddProgram] = useState(false)
  const [editingProgram, setEditingProgram] = useState<string | null>(null)
  const [form, setForm] = useState<ProgramForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const selected = programs.find(p => p.id === selectedId) ?? programs[0]
  const showToast = (message: string, ok: boolean) =>
    setToast({ message, type: ok ? 'success' : 'error' })
  const updateSlides = (programId: string, slides: ProgramSlide[]) =>
    setPrograms(prev => prev.map(p => p.id === programId ? { ...p, slides } : p))

  const openAdd = () => { setForm(emptyForm); setEditingProgram(null); setShowAddProgram(true) }
  const openEdit = (p: ProgramWithSlides) => {
    setForm({
      name: p.name, slug: p.slug, category: p.category ?? '',
      level: p.level ?? 'all_levels', short_description: p.short_description ?? '',
      duration_minutes: p.duration_minutes ? String(p.duration_minutes) : '',
    })
    setEditingProgram(p.id)
    setShowAddProgram(true)
  }

  const handleSaveProgram = async () => {
    if (!form.name.trim() || !form.slug.trim()) { showToast('Name and Slug are required.', false); return }
    setSaving(true)
    const payload = {
      name: form.name.trim(), slug: form.slug.trim(),
      category: form.category.trim() || null,
      level: form.level as 'all_levels' | 'beginner' | 'intermediate' | 'advanced',
      short_description: form.short_description.trim() || null,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      is_active: true,
    }
    if (editingProgram) {
      const res = await updateProgram(editingProgram, payload)
      setSaving(false)
      if (res.success) {
        setPrograms(prev => prev.map(p => p.id === editingProgram ? { ...p, ...payload } : p))
        showToast('Program updated!', true); setShowAddProgram(false)
      } else { showToast(!res.success ? res.error : 'Failed.', false) }
    } else {
      const res = await createProgram({ ...payload, is_featured: false, sort_order: programs.length })
      setSaving(false)
      if (res.success && res.id) {
        const newP: ProgramWithSlides = {
          id: res.id, ...payload, description: null, image_path: null,
          is_featured: false, sort_order: programs.length, slides: [],
        }
        setPrograms(prev => [...prev, newP])
        setSelectedId(res.id)
        showToast('Program created!', true); setShowAddProgram(false)
      } else { showToast(!res.success ? res.error : 'Failed.', false) }
    }
  }

  const handleDeleteProgram = async () => {
    if (!deleteProgramTarget) return
    const res = await deleteProgram(deleteProgramTarget)
    setDeleteProgramTarget(null)
    if (res.success) {
      const remaining = programs.filter(p => p.id !== deleteProgramTarget)
      setPrograms(remaining); setSelectedId(remaining[0]?.id ?? '')
      showToast('Program archived.', true)
    } else { showToast(res.error, false) }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selected) return
    e.target.value = ''; setUploading(true)
    const result = await uploadFileToStorage(file, 'revive-gallery', `program-slides/${selected.slug}`)
    if (!result) { setUploading(false); showToast('Upload failed.', false); return }
    const res = await addProgramSlide(selected.id, result.url)
    setUploading(false)
    if (res.success && res.id) {
      updateSlides(selected.id, [...selected.slides, {
        id: res.id, program_id: selected.id, image_url: result.url,
        alt_text: null, sort_order: selected.slides.length, is_active: true,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }])
      showToast('Slide added!', true)
    } else { showToast(res.error ?? 'Failed.', false) }
  }

  const handleUrlAdd = async () => {
    if (!urlInput.trim() || !selected) return
    const res = await addProgramSlide(selected.id, urlInput.trim())
    if (res.success && res.id) {
      updateSlides(selected.id, [...selected.slides, {
        id: res.id, program_id: selected.id, image_url: urlInput.trim(),
        alt_text: null, sort_order: selected.slides.length, is_active: true,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }])
      setUrlInput(''); showToast('Slide added!', true)
    } else { showToast(res.error ?? 'Failed.', false) }
  }

  const handleDeleteSlide = async () => {
    if (!deleteSlideTarget || !selected) return
    const res = await deleteProgramSlide(deleteSlideTarget)
    setDeleteSlideTarget(null)
    if (res.success) {
      updateSlides(selected.id, selected.slides.filter(s => s.id !== deleteSlideTarget))
      showToast('Slide removed.', true)
    } else { showToast(res.error ?? 'Failed.', false) }
  }

  const handleToggle = async (slide: ProgramSlide) => {
    const res = await toggleProgramSlide(slide.id, !slide.is_active)
    if (res.success) {
      updateSlides(selected.id, selected.slides.map(s =>
        s.id === slide.id ? { ...s, is_active: !s.is_active } : s
      ))
    } else { showToast(res.error ?? 'Failed.', false) }
  }

  const ic = 'bg-[#0a0b0a] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] placeholder:text-[#3a3530]'
  const btn = 'px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider transition-colors'

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={!!deleteSlideTarget} title="Remove this slide?" description="This slide will be removed from the slideshow." confirmLabel="Remove" destructive onConfirm={handleDeleteSlide} onCancel={() => setDeleteSlideTarget(null)} />
      <ConfirmDialog open={!!deleteProgramTarget} title="Archive this program?" description="The program will be hidden from the site. Its slides and data are preserved." confirmLabel="Archive" destructive onConfirm={handleDeleteProgram} onCancel={() => setDeleteProgramTarget(null)} />

      {showAddProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-lg" style={{ background: '#111312', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <h3 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase text-sm tracking-tight">
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </h3>
              <button onClick={() => setShowAddProgram(false)} className="text-[#4b5563] hover:text-[#f0ede8] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-5 py-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] uppercase tracking-wider block mb-1">Name *</label>
                  <input className={ic} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editingProgram ? f.slug : toSlug(e.target.value) }))} placeholder="e.g. MMA" />
                </div>
                <div>
                  <label className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] uppercase tracking-wider block mb-1">Slug *</label>
                  <input className={ic} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))} placeholder="e.g. mma" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] uppercase tracking-wider block mb-1">Category</label>
                  <input className={ic} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Combat Sports" />
                </div>
                <div>
                  <label className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] uppercase tracking-wider block mb-1">Level</label>
                  <select className={ic} value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                    <option value="all_levels">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] uppercase tracking-wider block mb-1">Duration (minutes)</label>
                <input className={ic} type="number" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} placeholder="e.g. 90" />
              </div>
              <div>
                <label className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] uppercase tracking-wider block mb-1">Short Description</label>
                <textarea className={`${ic} resize-none`} rows={2} value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} placeholder="One-line description shown on cards" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSaveProgram} disabled={saving} className="flex-1 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider py-2.5 hover:bg-white transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : editingProgram ? 'Save Changes' : 'Create Program'}
                </button>
                <button onClick={() => setShowAddProgram(false)} className="px-5 border border-white/10 text-[#6b6059] font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider hover:text-[#f0ede8] hover:border-white/20 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 items-start flex-wrap md:flex-nowrap">
        <div className="w-full md:w-60 shrink-0 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <p className="font-[family-name:var(--font-inter)] text-[11px] text-[#4b5563] uppercase tracking-wider">Programs</p>
            <button onClick={openAdd} className="flex items-center gap-1 px-2 py-1 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Add
            </button>
          </div>
          {programs.length === 0 && (
            <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563] py-4 text-center border border-dashed border-white/[0.06]">No programs. Click Add to create one.</p>
          )}
          {programs.map(p => (
            <div key={p.id} className={`group flex items-center gap-1 ${selectedId === p.id ? 'bg-[#ff571a]' : 'bg-[#0a0b0a] border border-white/[0.07] hover:border-white/20'}`}>
              <button onClick={() => setSelectedId(p.id)} className={`flex-1 text-left px-3 py-2.5 text-sm font-[family-name:var(--font-inter)] transition-colors flex items-center justify-between gap-2 ${selectedId === p.id ? 'text-black font-bold' : 'text-[#9a9088]'}`}>
                <span className="truncate">{p.name}</span>
                <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${selectedId === p.id ? 'bg-black/20 text-black' : 'bg-white/5 text-[#6b6059]'}`}>{p.slides.filter(s => s.is_active).length}</span>
              </button>
              <div className={`flex shrink-0 pr-1 gap-0.5 ${selectedId === p.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <button onClick={() => openEdit(p)} title="Edit" className={`w-6 h-6 flex items-center justify-center transition-colors ${selectedId === p.id ? 'text-black/60 hover:text-black' : 'text-[#4b5563] hover:text-[#f59e0b]'}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setDeleteProgramTarget(p.id)} title="Archive" className={`w-6 h-6 flex items-center justify-center transition-colors ${selectedId === p.id ? 'text-black/60 hover:text-black' : 'text-[#4b5563] hover:text-[#ef4444]'}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          {!selected ? (
            <div className="text-center py-16 border border-dashed border-white/[0.06]">
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#4b5563]">Create a program first to manage its slides.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-[family-name:var(--font-outfit)] text-base font-black text-[#f0ede8] uppercase tracking-tight">{selected.name}</h3>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563] mt-0.5">{selected.slides.length} slide{selected.slides.length !== 1 ? 's' : ''} - max 10</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(selected)} className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] text-[#9a9088] hover:text-[#f0ede8] hover:border-white/20 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit Program
                  </button>
                  <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] border border-white/[0.07] px-2 py-1 uppercase tracking-wider">/{selected.slug}</span>
                </div>
              </div>

              <div style={{ background: '#0a0b0a', border: '1px solid rgba(255,255,255,0.06)' }} className="p-4 space-y-3">
                <div className="flex gap-2">
                  {(['upload', 'url'] as const).map(tab => (
                    <button key={tab} onClick={() => setAddTab(tab)} className={`${btn} ${addTab === tab ? 'bg-[#ff571a] text-black' : 'border border-white/10 text-[#6b6059] hover:text-[#f0ede8]'}`}>
                      {tab === 'upload' ? 'Upload Image' : 'Paste URL'}
                    </button>
                  ))}
                </div>
                {addTab === 'upload' ? (
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    <button onClick={() => fileRef.current?.click()} disabled={uploading || selected.slides.length >= 10} className="w-full border-2 border-dashed border-white/10 hover:border-[#ff571a]/40 transition-colors py-8 flex flex-col items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                      {uploading ? (<><div className="w-5 h-5 border-2 border-[#ff571a] border-t-transparent rounded-full animate-spin" /><span className="font-[family-name:var(--font-inter)] text-xs text-[#6b6059]">Uploading...</span></>) : (
                        <><svg className="w-8 h-8 text-[#3a3530]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="font-[family-name:var(--font-inter)] text-sm text-[#6b6059]">{selected.slides.length >= 10 ? 'Max 10 slides reached' : 'Click to upload photo'}</span><span className="font-[family-name:var(--font-inter)] text-xs text-[#3a3530]">JPG, PNG, WebP - max 10MB</span></>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com/image.jpg" className={ic} onKeyDown={e => e.key === 'Enter' && handleUrlAdd()} />
                    <button onClick={handleUrlAdd} disabled={!urlInput.trim() || selected.slides.length >= 10} className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-black uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">Add</button>
                  </div>
                )}
              </div>

              {selected.slides.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/[0.06]">
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#4b5563]">No slides yet - upload images or paste URLs above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {selected.slides.map((slide, idx) => (
                    <div key={slide.id} className="relative group" style={{ opacity: slide.is_active ? 1 : 0.45 }}>
                      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: '#111' }}>
                        <Image src={slide.image_url} alt={slide.alt_text ?? `Slide ${idx + 1}`} fill className="object-cover" sizes="200px" />
                        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center"><span className="font-[family-name:var(--font-inter)] text-[10px] font-bold text-white">{idx + 1}</span></div>
                        {!slide.is_active && (<div className="absolute top-1.5 right-1.5 bg-[#3a3530] px-1.5 py-0.5"><span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-wider text-[#6b6059]">Hidden</span></div>)}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => handleToggle(slide)} title={slide.is_active ? 'Hide' : 'Show'} className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors">
                            {slide.is_active ? (<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>) : (<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>)}
                          </button>
                          <button onClick={() => setDeleteSlideTarget(slide.id)} title="Remove" className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-[#ef4444] hover:text-[#ef4444] transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] mt-1 truncate px-0.5">Slide {idx + 1} {!slide.is_active ? '- Hidden' : '- Visible'}</p>
                    </div>
                  ))}
                </div>
              )}
              {selected.slides.length > 0 && (
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563]">Slides show in order on the <a href={`/programs/${selected.slug}`} target="_blank" className="text-[#ff571a] hover:underline">{selected.name}</a> page.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
