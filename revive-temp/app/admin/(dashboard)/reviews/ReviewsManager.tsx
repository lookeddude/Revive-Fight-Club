'use client'

import { useState } from 'react'
import { createReview, updateReview, deleteReview } from '@/lib/actions/admin/contentActions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Toast } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { Review } from '@/types/database'

export function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<Review | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [reviewerName, setReviewerName] = useState('')
  const [reviewerRole, setReviewerRole] = useState('')
  const [rating, setRating] = useState('5')
  const [reviewText, setReviewText] = useState('')
  const [source, setSource] = useState('google')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)

  const resetForm = () => { setReviewerName(''); setReviewerRole(''); setRating('5'); setReviewText(''); setSource('google'); setIsFeatured(false); setIsPublished(true) }

  const handleEdit = (r: Review) => {
    setEditItem(r); setReviewerName(r.reviewer_name); setReviewerRole(r.reviewer_role ?? '')
    setRating(String(r.rating)); setReviewText(r.review_text); setSource(r.source)
    setIsFeatured(r.is_featured); setIsPublished(r.is_published); setShowAdd(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const input = {
      reviewer_name: reviewerName.trim(), reviewer_role: reviewerRole.trim() || null,
      rating: parseInt(rating), review_text: reviewText.trim(),
      source: source as Review['source'],
      is_featured: isFeatured, is_published: isPublished,
    }
    const result = editItem ? await updateReview(editItem.id, input) : await createReview(input)
    setSaving(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
    if (result.success) { resetForm(); setShowAdd(false); setEditItem(null) }
  }

  const handleArchive = async () => {
    if (!archiveTarget) return
    const result = await deleteReview(archiveTarget)
    setArchiveTarget(null)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
  }

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-body)] placeholder:text-[#4b5563]'
  const lc = 'block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={!!archiveTarget} title="Unpublish this review?" description="The review will be hidden from the public site." confirmLabel="Unpublish" destructive onConfirm={handleArchive} onCancel={() => setArchiveTarget(null)} />

      <div className="flex justify-end">
        <button onClick={() => { if (showAdd) { setShowAdd(false); setEditItem(null); resetForm() } else setShowAdd(true) }}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">
          {showAdd ? 'Cancel' : '+ New Review'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{editItem ? 'Edit Review' : 'New Review'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={lc}>Reviewer Name *</label><input value={reviewerName} onChange={e => setReviewerName(e.target.value)} required className={ic} /></div>
            <div><label className={lc}>Reviewer Role</label><input value={reviewerRole} onChange={e => setReviewerRole(e.target.value)} className={ic} placeholder="e.g. MMA Student" /></div>
            <div><label className={lc}>Rating (1–5)</label><select value={rating} onChange={e => setRating(e.target.value)} className={ic}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}</select></div>
            <div><label className={lc}>Source</label><select value={source} onChange={e => setSource(e.target.value)} className={ic}><option value="google">Google</option><option value="facebook">Facebook</option><option value="internal">Internal</option><option value="other">Other</option></select></div>
          </div>
          <div><label className={lc}>Review Text *</label><textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required rows={4} className={`${ic} resize-none`} /></div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Published</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">Featured</span></label>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}

      {reviews.length > 0 && (
        <div className="bg-[#111312] border border-white/[0.08] divide-y divide-white/[0.04]">
          {reviews.map(r => (
            <div key={r.id} className="p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{r.reviewer_name}</span>
                    {r.reviewer_role && <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">• {r.reviewer_role}</span>}
                    <span className="font-[family-name:var(--font-body)] text-xs text-[#ff571a]">★ {r.rating}</span>
                    <StatusBadge status={r.is_published ? 'published' : 'draft'} />
                    {r.is_featured && <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] border border-[#ff571a]/30 px-2 py-0.5">Featured</span>}
                  </div>
                  <p className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af] line-clamp-2">{r.review_text}</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => handleEdit(r)} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</button>
                  <button onClick={() => setArchiveTarget(r.id)} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-red-500/60 hover:text-red-400 transition-colors">Unpublish</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
