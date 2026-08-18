'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/StatusBadge'

type Trainer = {
  id: string
  name: string
  role: string | null
  slug: string
  is_active: boolean
  is_featured: boolean
  sort_order: number
  years_experience: number | null
}

export function TrainersTable({ trainers }: { trainers: Trainer[] }) {
  const [search, setSearch] = useState('')

  const filtered = trainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.role ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4b5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search trainers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-[#111312] border border-white/[0.07] font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] placeholder:text-[#4b5563] focus:outline-none focus:border-[#ff571a]/40 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#e2e3e1] transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      <div className="bg-[#111312] border border-white/[0.07]">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563]">No trainers match &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Name', 'Role', 'Experience', 'Status', 'Featured', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 bg-white/[0.02] text-left font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{t.name}</td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-[#9ca3af]">{t.role ?? '—'}</td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#4b5563]">{t.years_experience ? `${t.years_experience} yrs` : '—'}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={t.is_active ? 'active' : 'inactive'} /></td>
                    <td className="px-4 py-2.5">{t.is_featured && <span className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] border border-[#ff571a]/30 px-2 py-0.5">Featured</span>}</td>
                    <td className="px-4 py-2.5">
                      <Link href={`/admin/trainers/${t.id}`} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {search && <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563]">{filtered.length} of {trainers.length} trainers</p>}
    </div>
  )
}
