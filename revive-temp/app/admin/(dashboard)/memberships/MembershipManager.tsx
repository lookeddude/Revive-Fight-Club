'use client'

import { useState } from 'react'
import { createMembership, updateMembership } from '@/lib/actions/admin/contentActions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Toast } from '@/components/admin/Toast'
import type { MembershipPlan } from '@/types/database'

const BATCH_OPTIONS = [
  { value: 'beginners',    label: 'Beginners Batch' },
  { value: 'fighters',     label: 'Fighters Batch' },
  { value: 'kids_weekday', label: 'Kids Batch (Mon–Fri)' },
  { value: 'kids_weekend', label: 'Kids Batch (Sat–Sun)' },
]

const BILLING_OPTIONS = [
  { value: 'monthly',    label: 'Monthly' },
  { value: 'quarterly',  label: 'Quarterly' },
  { value: 'semiannual', label: 'Semiannual (6 months)' },
  { value: 'annually',   label: 'Yearly / Annually' },
]

const BATCH_ORDER = ['beginners', 'fighters', 'kids_weekday', 'kids_weekend']

const BATCH_LABELS: Record<string, string> = {
  beginners:    'Beginners Batch',
  fighters:     'Fighters Batch',
  kids_weekday: 'Kids Batch (Mon–Fri)',
  kids_weekend: 'Kids Batch (Sat–Sun)',
}

export function MembershipManager({ plans }: { plans: MembershipPlan[] }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [name, setName]             = useState('')
  const [slug, setSlug]             = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice]           = useState('')
  const [billing, setBilling]       = useState('monthly')
  const [sortLabel, setSortLabel]   = useState('')
  const [batchCat, setBatchCat]     = useState('beginners')
  const [features, setFeatures]     = useState('')
  const [isActive, setIsActive]     = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [sortOrder, setSortOrder]   = useState('')

  const resetForm = () => {
    setName(''); setSlug(''); setDescription(''); setPrice('')
    setBilling('monthly'); setSortLabel(''); setBatchCat('beginners')
    setFeatures(''); setIsActive(true); setIsFeatured(false); setSortOrder('')
  }

  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleEdit = (plan: MembershipPlan) => {
    setEditId(plan.id)
    setName(plan.name)
    setSlug(plan.slug)
    setDescription(plan.description ?? '')
    setPrice(String(plan.price ?? ''))
    setBilling(plan.billing_period)
    setSortLabel((plan as any).sort_label ?? '')
    setBatchCat((plan as any).batch_category ?? 'beginners')
    setFeatures((plan.features ?? []).join('\n'))
    setIsActive(plan.is_active)
    setIsFeatured(plan.is_featured)
    setSortOrder(String(plan.sort_order))
    setShowAdd(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const input = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      billing_period: billing as MembershipPlan['billing_period'],
      batch_category: batchCat || null,
      sort_label: sortLabel.trim() || null,
      features: features ? features.split('\n').map(f => f.trim()).filter(Boolean) : null,
      is_active: isActive,
      is_featured: isFeatured,
      sort_order: sortOrder ? parseInt(sortOrder) : undefined,
    }
    const result = editId ? await updateMembership(editId, input) : await createMembership(input)
    setSaving(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
    if (result.success) { resetForm(); setShowAdd(false); setEditId(null) }
  }

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-body)] placeholder:text-[#4b5563]'
  const lc = 'block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  // Group plans by batch_category
  const grouped = BATCH_ORDER.reduce<Record<string, MembershipPlan[]>>((acc, cat) => {
    acc[cat] = plans.filter(p => (p as any).batch_category === cat)
    return acc
  }, {})
  const ungrouped = plans.filter(p => !(p as any).batch_category)

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">{plans.length} plans across {BATCH_ORDER.filter(c => grouped[c]?.length > 0).length} batches</p>
        <button
          onClick={() => { if (showAdd) { setShowAdd(false); setEditId(null); resetForm() } else setShowAdd(true) }}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors"
        >
          {showAdd ? '✕ Cancel' : '+ New Plan'}
        </button>
      </div>

      {/* ── Add/Edit Form ── */}
      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{editId ? 'Edit Plan' : 'New Plan'}</h3>

          {/* Row 1: Name + Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lc}>Name *</label>
              <input value={name} onChange={e => { setName(e.target.value); if (!editId) setSlug(autoSlug(e.target.value)) }} required className={ic} placeholder="e.g. Beginners Monthly" />
            </div>
            <div>
              <label className={lc}>Slug *</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} required className={`${ic} font-mono`} placeholder="beginners-monthly" />
            </div>
          </div>

          {/* Row 2: Batch + Billing + Sort Label */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={lc}>Batch Category</label>
              <select value={batchCat} onChange={e => setBatchCat(e.target.value)} className={ic}>
                {BATCH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={lc}>Billing Period</label>
              <select value={billing} onChange={e => setBilling(e.target.value)} className={ic}>
                {BILLING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={lc}>Display Label</label>
              <input value={sortLabel} onChange={e => setSortLabel(e.target.value)} className={ic} placeholder="e.g. Monthly, Six Months" />
            </div>
          </div>

          {/* Row 3: Price + Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lc}>Price (₹)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" className={ic} placeholder="6500" />
            </div>
            <div>
              <label className={lc}>Sort Order</label>
              <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" className={ic} placeholder="1" />
            </div>
          </div>

          <div>
            <label className={lc}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={`${ic} resize-none`} placeholder="Short description shown on card" />
          </div>

          <div>
            <label className={lc}>Features (one per line)</label>
            <textarea value={features} onChange={e => setFeatures(e.target.value)} rows={4} className={`${ic} resize-none`} placeholder={`Unlimited classes\nLocker room access\n1 PT session/month`} />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Active</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Featured / Recommended</span></label>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : editId ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      )}

      {/* ── Plans grouped by batch ── */}
      {plans.length === 0 && !showAdd && (
        <div className="text-center py-16"><p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280]">No membership plans yet. Click "+ New Plan" to add one.</p></div>
      )}

      {BATCH_ORDER.filter(cat => grouped[cat]?.length > 0).map(cat => (
        <div key={cat} className="bg-[#111312] border border-white/[0.08] overflow-hidden">
          {/* Batch header */}
          <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: '#131514', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a]">{BATCH_LABELS[cat]}</span>
            <span className="font-[family-name:var(--font-body)] text-xs text-[#4b5563]">({grouped[cat].length} plans)</span>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">
              {['Display Label', 'Billing', 'Price', 'Sort', 'Status', 'Featured', ''].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#6b7280]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {grouped[cat].map(plan => (
                <tr key={plan.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{(plan as any).sort_label ?? plan.name}</td>
                  <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#6b7280] capitalize">{plan.billing_period}</td>
                  <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-sm font-bold text-[#ff571a]">{plan.price != null ? `₹${plan.price.toLocaleString('en-IN')}` : '—'}</td>
                  <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#4b5563]">{plan.sort_order}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={plan.is_active ? 'active' : 'inactive'} /></td>
                  <td className="px-4 py-2.5">{plan.is_featured && <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] border border-[#ff571a]/30 px-2 py-0.5">★</span>}</td>
                  <td className="px-4 py-2.5"><button onClick={() => handleEdit(plan)} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Ungrouped plans (no batch_category) */}
      {ungrouped.length > 0 && (
        <div className="bg-[#111312] border border-white/[0.08] overflow-hidden">
          <div className="px-4 py-2.5" style={{ background: '#131514', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#6b7280]">Other Plans</span>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-white/[0.06]">
              {['Name', 'Billing', 'Price', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#6b7280]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {ungrouped.map(plan => (
                <tr key={plan.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{plan.name}</td>
                  <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#6b7280] capitalize">{plan.billing_period}</td>
                  <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-sm font-bold text-[#ff571a]">{plan.price != null ? `₹${plan.price.toLocaleString('en-IN')}` : '—'}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={plan.is_active ? 'active' : 'inactive'} /></td>
                  <td className="px-4 py-2.5"><button onClick={() => handleEdit(plan)} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
