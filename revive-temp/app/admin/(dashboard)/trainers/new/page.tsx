import type { Metadata } from 'next'
import Link from 'next/link'
import { TrainerForm } from '../TrainerForm'

export const metadata: Metadata = { title: 'New Trainer' }

export default function NewTrainerPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/trainers" className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors uppercase tracking-wider">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Trainers
      </Link>
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">New Trainer</h2>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-1">Add a new trainer to the team.</p>
      </div>
      <TrainerForm mode="create" />
    </div>
  )
}
