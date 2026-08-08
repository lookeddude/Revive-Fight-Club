import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TrainersTable } from './TrainersTable'
import { EmptyState } from '@/components/admin/EmptyState'

export const metadata: Metadata = { title: 'Trainers' }

export default async function AdminTrainersPage() {
  const supabase = await createClient()
  const { data: trainers } = await supabase
    .from('trainers')
    .select('id, name, role, slug, is_active, is_featured, sort_order, years_experience')
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Trainers</h2>
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-0.5">{trainers?.length ?? 0} total</p>
        </div>
        <Link href="/admin/trainers/new" className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">+ New Trainer</Link>
      </div>

      {!trainers || trainers.length === 0 ? (
        <EmptyState title="No trainers yet" description="Add your first trainer." action={
          <Link href="/admin/trainers/new" className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">+ New Trainer</Link>
        } />
      ) : (
        <TrainersTable trainers={trainers} />
      )}
    </div>
  )
}
