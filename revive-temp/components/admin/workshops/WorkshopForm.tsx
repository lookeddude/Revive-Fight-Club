'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createWorkshop, updateWorkshop } from '@/lib/actions/admin/workshopActions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WorkshopForm({ initialData = {} as Record<string, any>, isEdit = false }: { initialData?: Record<string, any>, isEdit?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    slug: initialData.slug || '',
    short_description: initialData.short_description || '',
    description: initialData.description || '',
    cover_image_path: initialData.cover_image_path || '',
    workshop_mode: initialData.workshop_mode || 'in_person',
    start_datetime: initialData.start_datetime ? new Date(initialData.start_datetime).toISOString().slice(0, 16) : '',
    end_datetime: initialData.end_datetime ? new Date(initialData.end_datetime).toISOString().slice(0, 16) : '',
    registration_deadline: initialData.registration_deadline ? new Date(initialData.registration_deadline).toISOString().slice(0, 16) : '',
    location: initialData.location || '',
    online_meeting_url: initialData.online_meeting_url || '',
    pricing_type: initialData.pricing_type || 'paid',
    price: initialData.price || 0,
    capacity: initialData.capacity || '',
    waitlist_enabled: initialData.waitlist_enabled ?? true,
    status: initialData.status || 'draft',
    is_featured: initialData.is_featured ?? false,
    featured_order: initialData.featured_order || 0,
    what_you_will_learn: initialData.what_you_learn || [],
    requirements: initialData.requirements || [],
    instructors: initialData.instructors || [],
    faqs: initialData.faqs || [],
    registration_fields: initialData.registrationFields || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (name === 'title' && !isEdit) {
      setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'revive-workshops')
      fd.append('folder', initialData.id ? `${initialData.id}-cover` : `new-cover-${Date.now()}`)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setFormData(prev => ({ ...prev, cover_image_path: data.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const payload = {
      title: formData.title,
      slug: formData.slug,
      short_description: formData.short_description,
      description: formData.description,
      cover_image_path: formData.cover_image_path,
      gallery_images: (initialData.gallery_images as string[]) ?? [],
      location: formData.location,
      online_meeting_url: formData.online_meeting_url,
      workshop_mode: formData.workshop_mode as 'in_person' | 'online' | 'hybrid',
      start_datetime: new Date(formData.start_datetime).toISOString(),
      end_datetime: new Date(formData.end_datetime).toISOString(),
      registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : '',
      pricing_type: formData.pricing_type as 'free' | 'paid',
      price: formData.pricing_type === 'free' ? 0 : Number(formData.price),
      currency: 'INR',
      capacity: formData.capacity === '' ? null : Number(formData.capacity),
      waitlist_enabled: formData.waitlist_enabled,
      status: formData.status,
      is_featured: formData.is_featured,
      featured_order: Number(formData.featured_order),
      what_you_learn: (formData.what_you_will_learn as string[]) ?? [],
      requirements: (formData.requirements as string[]) ?? [],
      instructors: (formData.instructors as Array<{ name: string; bio: string; photo_path: string; display_order: number }>) ?? [],
      faqs: (formData.faqs as Array<{ question: string; answer: string; display_order: number }>) ?? [],
      registrationFields: (formData.registration_fields as Array<{ field_key: string; label: string; field_type: string; required: boolean; placeholder: string; options: string[]; display_order: number }>) ?? [],
    }

    try {
      const res = isEdit
        ? await updateWorkshop(initialData.id, payload)
        : await createWorkshop(payload)
      if (res.success) {
        setSuccess(isEdit ? 'Workshop updated!' : 'Workshop created!')
        setTimeout(() => router.push('/admin/workshops'), 800)
      } else {
        setError(res.error || 'Something went wrong')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving workshop')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/40 focus:outline-none font-[family-name:var(--font-body)] placeholder:text-[#4b5563] transition-colors'
  const labelClass = 'block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-1.5'
  const sectionClass = 'bg-[#0f1110] border border-white/[0.06] p-5 space-y-4'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── BASIC INFO ── */}
      <div className={sectionClass}>
        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">Basic Info</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Title *</label>
            <input name="title" required value={formData.title} onChange={handleChange}
              placeholder="e.g. MMA Fundamentals Workshop" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input name="slug" value={formData.slug} onChange={handleChange}
              placeholder="auto-generated-from-title" className={inputClass} />
            <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563] mt-1">URL: /workshops/{formData.slug || 'your-slug'}</p>
          </div>
          <div>
            <label className={labelClass}>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="draft">Draft (not visible to public)</option>
              <option value="published">Published (live on website)</option>
              <option value="closed">Closed (visible, no new registrations)</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {formData.status === 'draft' && (
              <p className="font-[family-name:var(--font-body)] text-xs text-yellow-500 mt-1">⚠ Draft workshops are NOT visible to the public. Change to Published to show on website.</p>
            )}
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Short Description</label>
            <textarea name="short_description" rows={2} value={formData.short_description} onChange={handleChange}
              placeholder="One-line summary shown in workshop cards" className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Full Description</label>
            <textarea name="description" rows={5} value={formData.description} onChange={handleChange}
              placeholder="Detailed description of the workshop" className={inputClass} />
          </div>
        </div>
      </div>

      {/* ── COVER IMAGE ── */}
      <div className={sectionClass}>
        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">Cover Image</h3>
        <div className="space-y-3">
          <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Recommended size: <span className="text-[#e2e3e1] font-bold">1200 × 675 px</span> (16:9 ratio) — JPEG, PNG or WebP — max 5 MB</p>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <span className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">
                {uploading ? 'Uploading…' : formData.cover_image_path ? 'Change Image' : 'Upload Image'}
              </span>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploading} className="hidden" />
            </label>
            {formData.cover_image_path && (
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, cover_image_path: '' }))}
                className="font-[family-name:var(--font-body)] text-xs text-red-400 hover:text-red-300 uppercase tracking-wider">
                Remove
              </button>
            )}
          </div>
          {formData.cover_image_path && (
            <div className="relative w-full max-w-sm aspect-video border border-white/[0.07] overflow-hidden">
              <Image src={formData.cover_image_path} alt="Cover preview" fill className="object-cover" unoptimized />
            </div>
          )}
          {!formData.cover_image_path && (
            <div className="w-full max-w-sm aspect-video border border-dashed border-white/[0.12] flex items-center justify-center">
              <span className="font-[family-name:var(--font-body)] text-xs text-[#4b5563]">No image uploaded</span>
            </div>
          )}
        </div>
      </div>

      {/* ── SCHEDULE ── */}
      <div className={sectionClass}>
        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">Schedule</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date & Time *</label>
            <input type="datetime-local" name="start_datetime" required value={formData.start_datetime} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End Date & Time *</label>
            <input type="datetime-local" name="end_datetime" required value={formData.end_datetime} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Registration Deadline</label>
            <input type="datetime-local" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mode</label>
            <select name="workshop_mode" value={formData.workshop_mode} onChange={handleChange} className={inputClass}>
              <option value="in_person">In-Person</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          {(formData.workshop_mode === 'in_person' || formData.workshop_mode === 'hybrid') && (
            <div className="col-span-2">
              <label className={labelClass}>Location / Venue</label>
              <input name="location" value={formData.location} onChange={handleChange}
                placeholder="e.g. Revive Fight Club, Bangalore" className={inputClass} />
            </div>
          )}
          {(formData.workshop_mode === 'online' || formData.workshop_mode === 'hybrid') && (
            <div className="col-span-2">
              <label className={labelClass}>Online Meeting URL <span className="text-[#4b5563] normal-case font-normal">(shared only in confirmation email)</span></label>
              <input name="online_meeting_url" type="url" value={formData.online_meeting_url} onChange={handleChange}
                placeholder="https://zoom.us/j/..." className={inputClass} />
            </div>
          )}
        </div>
      </div>

      {/* ── PRICING ── */}
      <div className={sectionClass}>
        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">Pricing & Capacity</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Pricing Type</label>
            <select name="pricing_type" value={formData.pricing_type} onChange={handleChange} className={inputClass}>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          {formData.pricing_type === 'paid' && (
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input type="number" name="price" min="0" step="1" value={formData.price} onChange={handleChange} className={inputClass} />
            </div>
          )}
          <div>
            <label className={labelClass}>Capacity <span className="text-[#4b5563] normal-case font-normal">(leave blank = unlimited)</span></label>
            <input type="number" name="capacity" min="1" value={formData.capacity} onChange={handleChange}
              placeholder="e.g. 30" className={inputClass} />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <input type="checkbox" name="waitlist_enabled" id="waitlist_enabled" checked={formData.waitlist_enabled} onChange={handleChange}
              className="w-4 h-4 border border-white/[0.2] bg-white/[0.03] accent-[#ff571a]" />
            <label htmlFor="waitlist_enabled" className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase tracking-wider cursor-pointer">Enable Waitlist</label>
          </div>
        </div>
      </div>

      {/* ── FEATURED ── */}
      <div className={sectionClass}>
        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">Homepage Feature</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_featured" id="is_featured" checked={formData.is_featured} onChange={handleChange}
              className="w-4 h-4 border border-white/[0.2] bg-white/[0.03] accent-[#ff571a]" />
            <label htmlFor="is_featured" className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] uppercase tracking-wider cursor-pointer">Show on Homepage</label>
          </div>
          {formData.is_featured && (
            <div>
              <label className={labelClass}>Display Order <span className="text-[#4b5563] normal-case font-normal">(1 = first)</span></label>
              <input type="number" name="featured_order" min="0" value={formData.featured_order} onChange={handleChange} className={inputClass} />
            </div>
          )}
        </div>
      </div>

      {/* ── ERRORS / SUCCESS ── */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 font-[family-name:var(--font-body)] text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 font-[family-name:var(--font-body)] text-sm">
          {success}
        </div>
      )}

      {/* ── SUBMIT ── */}
      <div className="flex gap-3">
        <button type="submit" disabled={loading || uploading}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-white transition-colors disabled:opacity-50">
          {loading ? 'Saving…' : isEdit ? 'Update Workshop' : 'Create Workshop'}
        </button>
        <button type="button" onClick={() => router.push('/admin/workshops')}
          className="border border-white/[0.07] text-[#9ca3af] font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-white/5 transition-colors">
          Cancel
        </button>
        {!isEdit && (
          <button type="button" onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
            className="ml-auto border border-green-500/40 text-green-400 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-green-500/10 transition-colors">
            Set as Published
          </button>
        )}
      </div>
      <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563]">
        ⚡ After saving, go to <strong className="text-[#9ca3af]">Admin → Workshops</strong> and use the <strong className="text-[#9ca3af]">Toggle</strong> button or set Status = Published to make it live.
      </p>
    </form>
  )
}
