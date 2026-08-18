import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProgramsTable } from './ProgramsTable'
import { EmptyState } from '@/components/admin/EmptyState'

export const metadata: Metadata = { title: 'Programs' }

export default async function AdminProgramsPage() {
  const supabase = await createClient()
  const { data: programs } = await supabase
    .from('programs')
    .select('id, name, slug, level, category, is_active, is_featured, sort_order')
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Programs</h2>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{programs?.length ?? 0} total</p>
        </div>
        <Link href="/admin/programs/new" className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">+ New Program</Link>
      </div>

      {!programs || programs.length === 0 ? (
        <EmptyState title="No programs yet" description="Create your first program to get started." action={
          <Link href="/admin/programs/new" className="bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">+ New Program</Link>
        } />
      ) : (
        <ProgramsTable programs={programs} />
      )}
    </div>
  )
}
