'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'spam', label: 'Spam' },
]

export function EnquiryFilters({
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
    if (key !== 'status' && currentStatus !== 'all') params.set('status', currentStatus)
    if (key !== 'search' && search) params.set('search', search)
    if (value) params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') updateParams('search', search) }}
        placeholder="Search by name, email, subject…"
        className="bg-[#111312] border border-white/[0.08] px-3 py-2 text-sm text-[#e2e3e1] placeholder:text-[#4b5563] focus:outline-none focus:border-[#ff571a]/50 transition-colors w-full sm:w-64 font-[family-name:var(--font-body)]"
      />
      <div className="flex gap-1 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s.value}
            onClick={() => updateParams('status', s.value)}
            className={`px-3 py-1.5 text-sm font-bold uppercase tracking-wider font-[family-name:var(--font-body)] transition-colors ${
              currentStatus === s.value ? 'bg-[#ff571a] text-black' : 'border border-white/[0.08] text-[#6b7280] hover:text-[#9ca3af] hover:border-white/20'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
