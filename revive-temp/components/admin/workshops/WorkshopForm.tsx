'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createWorkshop, updateWorkshop } from '@/lib/actions/admin/workshopActions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WorkshopForm({ initialData = {} as Record<string, any>, isEdit = false }: { initialData?: Record<string, any>, isEdit?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    what_you_will_learn: initialData.what_you_will_learn || [],
    requirements: initialData.requirements || [],
    instructors: initialData.instructors || [],
    faqs: initialData.faqs || [],
    registration_fields: initialData.registration_fields || []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'title' && !isEdit) {
      setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }))
    }
  }

  const handleArrayChange = (field: string, index: number, value: any) => {
    const newArray = [...formData[field as keyof typeof formData] as any[]]
    newArray[index] = value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: string, defaultItem: any) => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field as keyof typeof prev] as any[]), defaultItem] }))
  }

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...formData[field as keyof typeof formData] as any[]]
    newArray.splice(index, 1)
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

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
        router.push('/admin/workshops')
      } else {
        setError(res.error || 'Something went wrong')
      }
    } catch (err: any) {
      setError(err.message || 'Error saving workshop')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Title *</label>
          <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Slug *</label>
          <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Short Description (max 300) *</label>
        <textarea required maxLength={300} name="short_description" value={formData.short_description} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none h-20" />
      </div>

      <div className="space-y-1">
        <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Description *</label>
        <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none h-40" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Workshop Mode *</label>
          <select name="workshop_mode" value={formData.workshop_mode} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none [&>option]:bg-[#111312]">
            <option value="in_person">In Person</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Cover Image Path</label>
          <input name="cover_image_path" value={formData.cover_image_path} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Start Time *</label>
          <input required type="datetime-local" name="start_datetime" value={formData.start_datetime} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" style={{ colorScheme: 'dark' }} />
        </div>
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">End Time *</label>
          <input required type="datetime-local" name="end_datetime" value={formData.end_datetime} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" style={{ colorScheme: 'dark' }} />
        </div>
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Reg Deadline</label>
          <input type="datetime-local" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" style={{ colorScheme: 'dark' }} />
        </div>
      </div>

      {(formData.workshop_mode === 'in_person' || formData.workshop_mode === 'hybrid') && (
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Location *</label>
          <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
        </div>
      )}

      {(formData.workshop_mode === 'online' || formData.workshop_mode === 'hybrid') && (
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Online Meeting URL (shown only in confirmation emails) *</label>
          <input required name="online_meeting_url" value={formData.online_meeting_url} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Pricing Type</label>
          <select name="pricing_type" value={formData.pricing_type} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none [&>option]:bg-[#111312]">
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        {formData.pricing_type === 'paid' && (
          <div className="space-y-1">
            <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Price *</label>
            <input required type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
          </div>
        )}
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Capacity (Empty = Unltd)</label>
          <input type="number" min="1" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none [&>option]:bg-[#111312]">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="waitlist_enabled" checked={formData.waitlist_enabled} onChange={handleChange} className="accent-[#ff571a]" />
          <span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Enable Waitlist</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="accent-[#ff571a]" />
          <span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Is Featured</span>
        </label>
        {formData.is_featured && (
          <div className="flex items-center gap-2">
            <label className="font-[family-name:var(--font-body)] text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Order:</label>
            <input type="number" name="featured_order" value={formData.featured_order} onChange={handleChange} className="w-20 px-2 py-1 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.07] pt-6 space-y-4">
        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-lg uppercase tracking-tight">What You'll Learn</h3>
        {formData.what_you_will_learn.map((item: string, i: number) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => handleArrayChange('what_you_will_learn', i, e.target.value)} className="flex-1 px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none" />
            <button type="button" onClick={() => removeArrayItem('what_you_will_learn', i)} className="px-3 text-[#ff571a] border border-[#ff571a]/30 hover:bg-[#ff571a]/10">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('what_you_will_learn', '')} className="text-[#ff571a] font-bold text-xs uppercase tracking-wider">+ Add Item</button>
      </div>

      <div className="border-t border-white/[0.07] pt-6 space-y-4">
        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-lg uppercase tracking-tight">Instructors</h3>
        {formData.instructors.map((inst: any, i: number) => (
          <div key={i} className="p-4 bg-white/[0.02] border border-white/[0.07] space-y-3 relative">
            <button type="button" onClick={() => removeArrayItem('instructors', i)} className="absolute top-4 right-4 text-xs text-red-400">Remove</button>
            <input placeholder="Name" value={inst.name} onChange={e => handleArrayChange('instructors', i, { ...inst, name: e.target.value })} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1]" />
            <input placeholder="Bio" value={inst.bio} onChange={e => handleArrayChange('instructors', i, { ...inst, bio: e.target.value })} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1]" />
            <input placeholder="Photo Path" value={inst.photo_path} onChange={e => handleArrayChange('instructors', i, { ...inst, photo_path: e.target.value })} className="w-full px-3 py-2 bg-white/[0.02] border border-white/[0.07] text-sm text-[#e2e3e1]" />
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('instructors', { name: '', bio: '', photo_path: '' })} className="text-[#ff571a] font-bold text-xs uppercase tracking-wider">+ Add Instructor</button>
      </div>

      <div className="border-t border-white/[0.07] pt-6 flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider text-[#9ca3af] hover:text-white transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Workshop'}
        </button>
      </div>
    </form>
  )
}
