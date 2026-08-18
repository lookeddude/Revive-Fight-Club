'use client'

import { useState } from 'react'
import { restoreFromHistory } from '@/lib/actions/admin/imageActions'
import type { AssignmentHistory } from '@/lib/data/images'

interface SlotHistoryProps {
  slotTitle: string
  history: AssignmentHistory[]
  onClose: () => void
  onRestored: (url: string) => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export function SlotHistory({ slotTitle, history, onClose, onRestored }: SlotHistoryProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const handleRestore = async (entry: AssignmentHistory) => {
    if (!entry.previous_url) return
    setRestoringId(entry.id)
    const res = await restoreFromHistory(entry.id)
    setRestoringId(null)
    if (res.success) {
      setToast({ msg: 'Image restored successfully.', ok: true })
      setTimeout(() => { onRestored(entry.previous_url!) }, 800)
    } else {
      setToast({ msg: res.error, ok: false })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col" style={{ background: '#111312', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div>
            <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-[#f0ede8] uppercase">
              Image History
            </h2>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af] mt-0.5">{slotTitle}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#f0ede8] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mx-6 mt-4 px-4 py-2 text-xs font-[family-name:var(--font-body)] border ${
            toast.ok ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {toast.msg}
          </div>
        )}

        {/* History list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563]">No history yet.</p>
              <p className="font-[family-name:var(--font-body)] text-xs text-[#3a3530] mt-1">Changes will appear here after the first update.</p>
            </div>
          ) : (
            history.map((entry, i) => (
              <div key={entry.id} className="flex items-center gap-4 p-3 border border-white/[0.06]" style={{ background: '#0d0c0b' }}>
                {/* Thumbnail */}
                <div className="w-16 h-12 shrink-0 overflow-hidden border border-white/[0.08]">
                  {entry.new_url ? (
                    <img src={entry.new_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#1a1208] flex items-center justify-center">
                      <span className="text-[#3a3530] text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="inline-block px-1.5 py-0.5 bg-[#ff571a] text-black text-xs font-black uppercase tracking-wider">CURRENT</span>
                    )}
                    <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">{timeAgo(entry.changed_at)}</p>
                  </div>
                  {entry.new_url && (
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563] truncate mt-0.5">
                      {entry.new_url.split('/').pop()}
                    </p>
                  )}
                </div>

                {/* Restore button (not for current) */}
                {i > 0 && entry.previous_url && (
                  <button
                    onClick={() => handleRestore(entry)}
                    disabled={restoringId === entry.id}
                    className="shrink-0 px-3 py-1.5 border border-white/[0.1] text-[#9ca3af] font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider hover:border-[#ff571a]/50 hover:text-[#ff571a] transition-colors disabled:opacity-50"
                  >
                    {restoringId === entry.id ? '...' : 'Restore'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="w-full py-2 border border-white/[0.08] text-[#9ca3af] font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider hover:text-[#f0ede8] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
