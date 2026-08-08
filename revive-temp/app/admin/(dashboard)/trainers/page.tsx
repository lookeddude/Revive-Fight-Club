import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/admin/StatusBadge'
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
        <Link href="/admin/trainers/new" className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">
          + New Trainer
        </Link>
      </div>

      {!trainers || trainers.length === 0 ? (
        <EmptyState title="No trainers yet" description="Add your first trainer." action={
          <Link href="/admin/trainers/new" className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-white transition-colors">+ New Trainer</Link>
        } />
      ) : (
        <div className="bg-[#111312] border border-white/[0.08]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Name', 'Role', 'Experience', 'Status', 'Featured', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainers.map(t => (
                  <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-sm font-medium text-[#e2e3e1]">{t.name}</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-sm text-[#9ca3af]">{t.role}</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">{t.years_experience ? `${t.years_experience}y` : '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.is_active ? 'active' : 'inactive'} /></td>
                    <td className="px-4 py-3">
                      {t.is_featured && <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#ff571a] border border-[#ff571a]/30 px-2 py-0.5">Featured</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/trainers/${t.id}`} className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
