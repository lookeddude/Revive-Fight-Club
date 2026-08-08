'use client'

import { useState } from 'react'
import { createMembership, updateMembership } from '@/lib/actions/admin/contentActions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Toast } from '@/components/admin/Toast'
import type { MembershipPlan } from '@/types/database'

export function MembershipManager({ plans }: { plans: MembershipPlan[] }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [billing, setBilling] = useState('monthly')
  const [features, setFeatures] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  const resetForm = () => { setName(''); setSlug(''); setDescription(''); setPrice(''); setBilling('monthly'); setFeatures(''); setIsActive(true); setIsFeatured(false) }

  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleEdit = (plan: MembershipPlan) => {
    setEditId(plan.id)
    setName(plan.name); setSlug(plan.slug); setDescription(plan.description ?? '')
    setPrice(String(plan.price ?? '')); setBilling(plan.billing_period)
    setFeatures((plan.features ?? []).join('\n'))
    setIsActive(plan.is_active); setIsFeatured(plan.is_featured)
    setShowAdd(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const input = {
      name: name.trim(), slug: slug.trim(),
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      billing_period: billing as MembershipPlan['billing_period'],
      features: features ? features.split('\n').map(f => f.trim()).filter(Boolean) : null,
      is_active: isActive, is_featured: isFeatured,
    }
    const result = editId ? await updateMembership(editId, input) : await createMembership(input)
    setSaving(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
    if (result.success) { resetForm(); setShowAdd(false); setEditId(null) }
  }

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] placeholder:text-[#4b5563]'
  const lc = 'block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-end">
        <button onClick={() => { if (showAdd) { setShowAdd(false); setEditId(null); resetForm() } else setShowAdd(true) }}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">
          {showAdd ? 'Cancel' : '+ New Plan'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{editId ? 'Edit Plan' : 'New Plan'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={lc}>Name *</label><input value={name} onChange={e => { setName(e.target.value); if (!editId) setSlug(autoSlug(e.target.value)) }} required className={ic} placeholder="e.g. Monthly MMA" /></div>
            <div><label className={lc}>Slug *</label><input value={slug} onChange={e => setSlug(e.target.value)} required className={`${ic} font-mono`} placeholder="monthly-mma" /></div>
            <div><label className={lc}>Price (INR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" className={ic} placeholder="3500" /></div>
            <div><label className={lc}>Billing Period</label>
              <select value={billing} onChange={e => setBilling(e.target.value)} className={ic}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
          <div><label className={lc}>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={`${ic} resize-none`} /></div>
          <div><label className={lc}>Features (one per line)</label><textarea value={features} onChange={e => setFeatures(e.target.value)} rows={4} className={`${ic} resize-none`} placeholder="Unlimited classes&#10;Locker room access&#10;1 PT session/month" /></div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Active</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Featured</span></label>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">{saving ? 'Saving…' : editId ? 'Update Plan' : 'Create Plan'}</button>
          </div>
        </form>
      )}

      {plans.length === 0 && !showAdd && <div className="text-center py-16"><p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280]">No membership plans yet.</p></div>}

      {plans.length > 0 && (
        <div className="bg-[#111312] border border-white/[0.08] overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">
              {['Name', 'Price', 'Period', 'Status', 'Featured', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-sm font-medium text-[#e2e3e1]">{plan.name}</td>
                  <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-sm text-[#9ca3af]">{plan.price != null ? `₹${plan.price.toLocaleString('en-IN')}` : '—'}</td>
                  <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-xs text-[#6b7280] capitalize">{plan.billing_period}</td>
                  <td className="px-4 py-3"><StatusBadge status={plan.is_active ? 'active' : 'inactive'} /></td>
                  <td className="px-4 py-3">{plan.is_featured && <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#ff571a] border border-[#ff571a]/30 px-2 py-0.5">Featured</span>}</td>
                  <td className="px-4 py-3"><button onClick={() => handleEdit(plan)} className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
