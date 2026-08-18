'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateTrialStatus, updateTrialNotes } from '@/lib/actions/admin/trialActions'
import { Toast } from '@/components/admin/Toast'
import type { TrialRequestStatus } from '@/types/database'

const STATUSES: TrialRequestStatus[] = [
  'pending', 'contacted', 'confirmed', 'completed', 'cancelled', 'no_show'
]

export function TrialDetailActions({
  id,
  currentStatus,
  currentNotes,
}: {
  id: string
  currentStatus: TrialRequestStatus
  currentNotes: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState<TrialRequestStatus>(currentStatus)
  const [notes, setNotes] = useState(currentNotes)
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleStatusChange = async (newStatus: TrialRequestStatus) => {
    if (newStatus === status) return
    setSavingStatus(true)
    const result = await updateTrialStatus(id, newStatus)
    setSavingStatus(false)
    if (result.success) {
      setStatus(newStatus)
      setToast({ message: result.message, type: 'success' })
      router.refresh()
    } else {
      setToast({ message: result.error, type: 'error' })
    }
  }

  const handleSaveNotes = async () => {
    setSavingNotes(true)
    const result = await updateTrialNotes(id, notes)
    setSavingNotes(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
  }

  return (
    <div className="space-y-5">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Status */}
      <div className="bg-[#111312] border border-white/[0.08] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Update Status</h3>
          {savingStatus && <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Saving…</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={savingStatus}
              className={`px-3 py-1.5 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                status === s
                  ? 'bg-[#ff571a] text-black'
                  : 'border border-white/[0.08] text-[#6b7280] hover:border-white/20 hover:text-[#9ca3af]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-[#111312] border border-white/[0.08] p-5">
        <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-3">Admin Notes</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          placeholder="Add internal notes about this trial request…"
          className="w-full bg-[#0d0f0e] border border-white/[0.08] px-3 py-2.5 text-sm text-[#e2e3e1] placeholder:text-[#4b5563] focus:outline-none focus:border-[#ff571a]/50 transition-colors resize-none font-[family-name:var(--font-body)]"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="px-4 py-2 bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
          >
            {savingNotes ? 'Saving…' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  )
}
