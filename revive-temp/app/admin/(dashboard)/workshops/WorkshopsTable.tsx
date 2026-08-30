'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateWorkshopStatus, duplicateWorkshop } from '@/lib/actions/admin/workshopActions'
import { StatusBadge } from '@/components/admin/StatusBadge'

export function WorkshopsTable({ workshops }: { workshops: any[] }) {
  const [search, setSearch] = useState('')

  const isSearching = search.length > 0
  const displayed = isSearching
    ? workshops.filter(w =>
        w.title.toLowerCase().includes(search.toLowerCase())
      )
    : workshops

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'published': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'closed': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'archived': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4b5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search workshops..."
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
        {displayed.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563]">No workshops match &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Title', 'Status', 'Type', 'Capacity', 'Registrations', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 bg-white/[0.02] text-left font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map(w => (
                  <tr key={w.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{w.title}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 border font-[family-name:var(--font-body)] text-[10px] font-bold uppercase tracking-wider ${getStatusColor(w.status)}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">
                      {w.pricing_type === 'free' ? 'FREE' : `PAID (${w.price})`}
                    </td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">
                      {w.capacity ? w.capacity : 'Unlimited'}
                    </td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">
                      {w.registration_count || 0}
                    </td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">
                      {new Date(w.start_datetime).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3 flex-wrap">
                      <Link href={`/admin/workshops/${w.id}/registrations`} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">
                        Regs ({w.totalRegistrations ?? 0})
                      </Link>
                      <Link href={`/admin/workshops/${w.id}`} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] hover:text-white transition-colors">
                        Edit
                      </Link>
                      {w.status === 'draft' && (
                        <form action={async (): Promise<void> => { await updateWorkshopStatus(w.id, 'published') }}>
                          <button type="submit" className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-green-400 hover:text-white transition-colors">
                            Publish
                          </button>
                        </form>
                      )}
                      {w.status === 'published' && (
                        <form action={async (): Promise<void> => { await updateWorkshopStatus(w.id, 'closed') }}>
                          <button type="submit" className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-yellow-400 hover:text-white transition-colors">
                            Close
                          </button>
                        </form>
                      )}
                      {(w.status === 'closed' || w.status === 'completed') && (
                        <form action={async (): Promise<void> => { await updateWorkshopStatus(w.id, 'draft') }}>
                          <button type="submit" className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#4b5563] hover:text-white transition-colors">
                            → Draft
                          </button>
                        </form>
                      )}
                      <form action={async (): Promise<void> => { await duplicateWorkshop(w.id) }}>
                        <button type="submit" className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#4b5563] hover:text-white transition-colors">
                          Dup
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
