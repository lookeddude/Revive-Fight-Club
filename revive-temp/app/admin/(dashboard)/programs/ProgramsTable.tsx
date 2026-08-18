'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { reorderProgram } from '@/lib/actions/admin/programs'

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

function sortByOrder(list: Program[]) {
  return [...list].sort((a, b) => a.sort_order - b.sort_order)
}

export function ProgramsTable({ programs }: { programs: Program[] }) {
  const [search, setSearch] = useState('')
  const [, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [movingId, setMovingId] = useState<string | null>(null)

  // Local list — moves instantly on click, syncs when server re-renders parent
  const [localList, setLocalList] = useState<Program[]>(() => sortByOrder(programs))

  // Sync when server revalidates and passes fresh props
  useEffect(() => {
    setLocalList(sortByOrder(programs))
  }, [programs])

  const isSearching = search.length > 0

  const displayed = isSearching
    ? localList.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.slug ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (p.category ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : localList

  function move(id: string, direction: 'up' | 'down') {
    setError('')
    setMovingId(id)

    // 1. Move instantly in local state
    setLocalList(prev => {
      const list = [...prev]
      const idx = list.findIndex(p => p.id === id)
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (idx === -1 || swapIdx < 0 || swapIdx >= list.length) return prev
      const tmp = list[idx].sort_order
      list[idx] = { ...list[idx], sort_order: list[swapIdx].sort_order }
      list[swapIdx] = { ...list[swapIdx], sort_order: tmp }
      return sortByOrder(list)
    })

    // 2. Persist to server in background
    startTransition(async () => {
      const result = await reorderProgram(id, direction)
      setMovingId(null)
      if (!result.success) {
        setError(result.error ?? 'Failed to reorder.')
        // Revert to server data on failure
        setLocalList(sortByOrder(programs))
      }
    })
  }

  return (
    <div className="space-y-3">
      {/* Info banner */}
      <div className="flex items-center gap-3 p-3 border border-[#ff571a]/20 bg-[#ff571a]/5">
        <svg className="w-4 h-4 text-[#ff571a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#ff571a]">
          <strong>Top 4 programs</strong> by position are automatically shown as featured on the website. Use &#8593;&#8595; to reorder.
        </p>
      </div>

      {error && (
        <div className="flex items-center justify-between p-3 border border-red-500/30 bg-red-500/10">
          <span className="font-[family-name:var(--font-body)] text-xs text-red-400">{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-[#ff571a] ml-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

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
            <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563]">No programs match &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Name', 'Category', 'Level', 'Status', 'Featured', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 bg-white/[0.02] text-left font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((p, displayIdx) => {
                  const trueIdx = isSearching
                    ? localList.findIndex(s => s.id === p.id)
                    : displayIdx
                  const isFeatured = trueIdx < 4 && p.is_active
                  const isFirst = !isSearching && displayIdx === 0
                  const isLast = !isSearching && displayIdx === displayed.length - 1
                  const isMoving = movingId === p.id

                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-white/[0.04] transition-all duration-150 ${
                        isFeatured ? 'bg-[#ff571a]/[0.03] hover:bg-[#ff571a]/[0.05]' : 'hover:bg-white/[0.02]'
                      } ${isMoving ? 'opacity-60' : 'opacity-100'}`}
                    >
                      {/* Name */}
                      <td className="px-4 py-2.5">
                        <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{p.name}</span>
                        {p.slug && <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-0.5">{p.slug}</p>}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-sm text-[#9ca3af]">
                        {p.category ?? '\u2014'}
                      </td>

                      {/* Level */}
                      <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#9ca3af] capitalize">
                        {p.level?.replace('_', ' ') ?? '\u2014'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-2.5"><StatusBadge status={p.is_active ? 'active' : 'inactive'} /></td>

                      {/* Featured badge */}
                      <td className="px-4 py-2.5">
                        {isFeatured ? (
                          <span className="inline-flex items-center gap-1 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] border border-[#ff571a]/30 px-2 py-0.5">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            Featured
                          </span>
                        ) : (
                          <span className="font-[family-name:var(--font-body)] text-xs text-[#4b5563]">Not shown</span>
                        )}
                      </td>

                      {/* Up / Down buttons — only disabled for the row currently saving */}
                      <td className="px-4 py-3">
                        {!isSearching && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => !isMoving && !isFirst && move(p.id, 'up')}
                              disabled={isMoving || isFirst}
                              title="Move up"
                              className="w-7 h-7 flex items-center justify-center border border-white/[0.08] text-[#6b7280] hover:text-white hover:border-[#ff571a]/50 hover:bg-[#ff571a]/10 active:scale-95 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => !isMoving && !isLast && move(p.id, 'down')}
                              disabled={isMoving || isLast}
                              title="Move down"
                              className="w-7 h-7 flex items-center justify-center border border-white/[0.08] text-[#6b7280] hover:text-white hover:border-[#ff571a]/50 hover:bg-[#ff571a]/10 active:scale-95 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Edit */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/programs/${p.id}`}
                          className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#ff571a] flex items-center justify-center">
            <span className="font-[family-name:var(--font-outfit)] font-bold text-black text-xs">1</span>
          </div>
          <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Positions 1&#8211;4 = featured on website</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white/[0.06] flex items-center justify-center">
            <span className="font-[family-name:var(--font-outfit)] font-bold text-[#6b7280] text-xs">5</span>
          </div>
          <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Position 5+ = not shown</span>
        </div>
        {search && (
          <span className="font-[family-name:var(--font-body)] text-xs text-[#4b5563] ml-auto">
            {displayed.length} of {programs.length} programs
          </span>
        )}
      </div>
    </div>
  )
}
