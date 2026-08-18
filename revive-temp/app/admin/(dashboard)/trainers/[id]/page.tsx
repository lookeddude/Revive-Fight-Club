import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TrainerForm } from '../TrainerForm'

export const metadata: Metadata = { title: 'Edit Trainer' }

export default async function EditTrainerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: trainer } = await supabase.from('trainers').select('*').eq('id', id).single()
  if (!trainer) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/trainers" className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors uppercase tracking-wider">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Trainers
      </Link>
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Edit Trainer</h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-1">{trainer.name}</p>
      </div>
      <TrainerForm mode="edit" trainer={trainer} />
    </div>
  )
}
