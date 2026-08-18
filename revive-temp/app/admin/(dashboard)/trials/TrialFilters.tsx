'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
]

export function TrialFilters({
  currentStatus,
  currentSearch,
}: {
  currentStatus: string
  currentSearch: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(currentSearch)

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (key !== 'status') params.set('status', currentStatus !== 'all' ? currentStatus : '')
    if (key !== 'search') params.set('search', search)
    params.set(key, value)
    params.delete('page')
    // Remove empty params
    const clean = new URLSearchParams()
    params.forEach((v, k) => { if (v) clean.set(k, v) })
    router.push(`${pathname}?${clean.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') updateParams('search', search) }}
        placeholder="Search by name, phone, email…"
        className="bg-[#111312] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] placeholder:text-[#4b5563] focus:outline-none focus:border-[#ff571a]/50 transition-colors w-full sm:w-64 font-[family-name:var(--font-body)]"
      />

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => updateParams('status', s.value)}
            className={`px-3 py-1.5 text-sm font-bold uppercase tracking-wider font-[family-name:var(--font-body)] transition-colors ${
              currentStatus === s.value
                ? 'bg-[#ff571a] text-black'
                : 'border border-white/[0.08] text-[#6b7280] hover:text-[#9ca3af] hover:border-white/20'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
