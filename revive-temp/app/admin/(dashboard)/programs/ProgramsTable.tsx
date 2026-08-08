'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/StatusBadge'

type Program = {
  id: string
  name: string
  slug: string
  level: string | null
  category: string | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
}

export function ProgramsTable({ programs }: { programs: Program[] }) {
  const [search, setSearch] = useState('')

  const filtered = programs.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.slug ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4b5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search programs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-[#111312] border border-white/[0.07] font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] placeholder:text-[#4b5563] focus:outline-none focus:border-[#ff571a]/40 transition-colors"
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
            <p className="font-[family-name:var(--font-inter)] text-sm text-[#4b5563]">No programs match &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Name', 'Slug', 'Level', 'Category', 'Status', 'Featured', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#4b5563]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-sm font-medium text-[#e2e3e1]">{p.name}</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-xs text-[#4b5563] font-mono">{p.slug}</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-xs text-[#9ca3af] capitalize">{p.level?.replace('_', ' ') ?? '—'}</td>
                    <td className="px-4 py-3 font-[family-name:var(--font-inter)] text-xs text-[#9ca3af]">{p.category ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.is_active ? 'active' : 'inactive'} /></td>
                    <td className="px-4 py-3">
                      {p.is_featured && <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#ff571a] border border-[#ff571a]/30 px-2 py-0.5">Featured</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/programs/${p.id}`} className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {search && (
        <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563]">{filtered.length} of {programs.length} programs</p>
      )}
    </div>
  )
}
