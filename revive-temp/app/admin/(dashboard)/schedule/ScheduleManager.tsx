'use client'

import { useState } from 'react'
import { createScheduleItem, updateScheduleItem, deleteScheduleItem } from '@/lib/actions/admin/contentActions'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Toast } from '@/components/admin/Toast'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

type ScheduleItemRow = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  level: string | null
  location: string | null
  is_active: boolean
  programs: { name: string } | null
  trainers: { name: string } | null
}

type Program = { id: string; name: string }
type Trainer = { id: string; name: string }

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function ScheduleManager({
  items,
  programs,
  trainers,
}: {
  items: ScheduleItemRow[]
  programs: Program[]
  trainers: Trainer[]
}) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // New item form state
  const [newProgramId, setNewProgramId] = useState(programs[0]?.id ?? '')
  const [newTrainerId, setNewTrainerId] = useState('')
  const [newDay, setNewDay] = useState(1)
  const [newStart, setNewStart] = useState('06:00')
  const [newEnd, setNewEnd] = useState('07:00')
  const [newLevel, setNewLevel] = useState<'all_levels' | 'beginner' | 'intermediate' | 'advanced' | ''>('')
  const [newLocation, setNewLocation] = useState('')

  const handleAdd = async () => {
    if (!newProgramId) {
      setToast({ message: 'Please select a program first.', type: 'error' })
      return
    }
    if (newEnd <= newStart) {
      setToast({ message: 'End time must be after start time.', type: 'error' })
      return
    }
    setSubmitting(true)
    const result = await createScheduleItem({
      program_id: newProgramId,
      trainer_id: newTrainerId || null,
      day_of_week: newDay,
      start_time: newStart,
      end_time: newEnd,
      level: newLevel ? newLevel as 'all_levels' | 'beginner' | 'intermediate' | 'advanced' : null,
      location: newLocation || null,
      is_active: true,
    })
    setSubmitting(false)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
    if (result.success) setShowAdd(false)
  }

  const handleToggleActive = async (item: ScheduleItemRow) => {
    const result = await updateScheduleItem(item.id, { is_active: !item.is_active })
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const result = await deleteScheduleItem(deleteTarget)
    setDeleteTarget(null)
    setToast({ message: result.success ? result.message : result.error, type: result.success ? 'success' : 'error' })
  }

  const ic = 'bg-[#0d0f0e] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/50 w-full font-[family-name:var(--font-body)] placeholder:text-[#4b5563]'

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmDialog open={!!deleteTarget} title="Deactivate this session?" description="This class will be removed from the public schedule." confirmLabel="Deactivate" destructive onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />

      <div className="flex justify-end">
        <button onClick={() => setShowAdd(!showAdd)} className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">
          {showAdd ? 'Cancel' : '+ Add Session'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#111312] border border-white/[0.08] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">New Schedule Session</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Program *</label>
              <select value={newProgramId} onChange={e => setNewProgramId(e.target.value)} className={ic}>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Trainer (optional)</label>
              <select value={newTrainerId} onChange={e => setNewTrainerId(e.target.value)} className={ic}>
                <option value="">None</option>
                {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Day *</label>
              <select value={newDay} onChange={e => setNewDay(parseInt(e.target.value))} className={ic}>
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Start Time *</label>
              <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)} className={ic} />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">End Time *</label>
              <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)} className={ic} />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Level</label>
              <select value={newLevel} onChange={e => setNewLevel(e.target.value as typeof newLevel)} className={ic}>
                <option value="">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider mb-1.5">Location</label>
              <input value={newLocation} onChange={e => setNewLocation(e.target.value)} className={ic} placeholder="e.g. Main Mat" />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleAdd} disabled={submitting || !newProgramId} className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors disabled:opacity-50">
              {submitting ? 'Adding…' : 'Add Session'}
            </button>
          </div>
        </div>
      )}

      {/* Schedule grid by day */}
      {DAYS.map((day, dayIdx) => {
        const dayItems = items.filter(i => i.day_of_week === dayIdx)
        if (dayItems.length === 0) return null
        return (
          <div key={day} className="bg-[#111312] border border-white/[0.08]">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{day}</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {dayItems.map(item => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-[family-name:var(--font-body)] text-xs font-mono text-[#6b7280] w-24 flex-shrink-0">
                      {item.start_time.slice(0,5)} – {item.end_time.slice(0,5)}
                    </span>
                    <div>
                      <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{item.programs?.name}</span>
                      {item.trainers && <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] ml-2">• {item.trainers.name}</span>}
                      {item.level && <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] ml-2 capitalize">• {item.level}</span>}
                      {item.location && <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] ml-2">• {item.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.is_active ? 'active' : 'inactive'} />
                    <button onClick={() => handleToggleActive(item)} className="font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider text-[#6b7280] hover:text-[#9ca3af] transition-colors">
                      {item.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => setDeleteTarget(item.id)} className="font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider text-red-500/60 hover:text-red-400 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {items.length === 0 && (
        <div className="text-center py-16">
          <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280]">No schedule sessions yet. Add your first session above.</p>
        </div>
      )}
    </div>
  )
}
