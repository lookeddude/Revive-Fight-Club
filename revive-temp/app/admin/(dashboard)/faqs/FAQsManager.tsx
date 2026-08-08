'use client'

import { useState } from 'react'
import { createFAQ, updateFAQ, deleteFAQ } from '@/lib/actions/admin/contentActions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Toast } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { FAQ } from '@/types/database'

export function FAQsManager({ faqs }: { faqs: FAQ[] }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<FAQ | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [sortOrder, setSortOrder] = useState('0')

  const resetForm = () => { setQuestion(''); setAnswer(''); setCategory(''); setIsPublished(true); setSortOrder('0') }

  const handleEdit = (faq: FAQ) => {
    setEditItem(faq); setQuestion(faq.question); setAnswer(faq.answer)
    setCategory(faq.category ?? ''); setIsPublished(faq.is_published)
    setSortOrder(String(faq.sort_order)); setShowAdd(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const input = { question: question.trim(), answer: answer.trim(), category: category.trim() || null, is_published: isPublished, sort_order: parseInt(sortOrder) || 0 }
    const result = editItem ? await updateFAQ(editItem.id, input) : await createFAQ(input)
    setSaving(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
    if (result.success) { resetForm(); setShowAdd(false); setEditItem(null) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const result = await deleteFAQ(deleteTarget)
    setDeleteTarget(null)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
  }

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-inter)] placeholder:text-[#4b5563]'
  const lc = 'block font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={!!deleteTarget} title="Delete this FAQ?" description="This FAQ will be permanently deleted." confirmLabel="Delete" destructive onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />

      <div className="flex justify-end">
        <button onClick={() => { if (showAdd) { setShowAdd(false); setEditItem(null); resetForm() } else setShowAdd(true) }}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">
          {showAdd ? 'Cancel' : '+ New FAQ'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{editItem ? 'Edit FAQ' : 'New FAQ'}</h3>
          <div><label className={lc}>Question *</label><input value={question} onChange={e => setQuestion(e.target.value)} required className={ic} placeholder="What are your opening hours?" /></div>
          <div><label className={lc}>Answer *</label><textarea value={answer} onChange={e => setAnswer(e.target.value)} required rows={4} className={`${ic} resize-none`} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={lc}>Category</label><input value={category} onChange={e => setCategory(e.target.value)} className={ic} placeholder="e.g. General" /></div>
            <div><label className={lc}>Sort Order</label><input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} min="0" className={ic} /></div>
            <div className="flex items-center pt-5"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-4 h-4 accent-[#ff571a]" /><span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">Published</span></label></div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">{saving ? 'Saving…' : editItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}

      {faqs.length > 0 && (
        <div className="bg-[#111312] border border-white/[0.08] divide-y divide-white/[0.04]">
          {faqs.map(faq => (
            <div key={faq.id} className="p-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {faq.category && <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#6b7280] border border-white/[0.08] px-2 py-0.5">{faq.category}</span>}
                    <StatusBadge status={faq.is_published ? 'published' : 'draft'} />
                  </div>
                  <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#e2e3e1] mb-1">{faq.question}</p>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#9ca3af] line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => handleEdit(faq)} className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</button>
                  <button onClick={() => setDeleteTarget(faq.id)} className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-red-500/60 hover:text-red-400 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
