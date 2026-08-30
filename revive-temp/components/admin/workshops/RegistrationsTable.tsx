'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateRegistrationStatus } from '@/lib/actions/admin/workshopRegistrationActions'

interface RegistrationsTableProps {
  workshopId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registrations: any[]
}

export function RegistrationsTable({ workshopId, registrations }: RegistrationsTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = registrations.filter(r => {
    const matchesSearch = (r.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (r.email || '').toLowerCase().includes(search.toLowerCase()) ||
                          (r.registration_id || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.registration_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'waitlisted': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'attended': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'no_show': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'cancelled': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search name, email, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 bg-[#111312] border border-white/[0.07] font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] placeholder:text-[#4b5563] focus:outline-none focus:border-[#ff571a]/40 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-48 px-3 py-2.5 bg-[#111312] border border-white/[0.07] font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] focus:outline-none focus:border-[#ff571a]/40 [&>option]:bg-[#111312]"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="attended">Attended</option>
          <option value="no_show">No Show</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-[#111312] border border-white/[0.07]">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-[family-name:var(--font-body)] text-sm text-[#4b5563]">No registrations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['ID', 'Name / Email', 'Status', 'Payment', 'Amount', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 bg-white/[0.02] text-left font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#6b7280]">
                      {r.registration_id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{r.full_name}</div>
                      <div className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">{r.email}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 border font-[family-name:var(--font-body)] text-[10px] font-bold uppercase tracking-wider ${getStatusColor(r.registration_status)}`}>
                        {r.registration_status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 border font-[family-name:var(--font-body)] text-[10px] font-bold uppercase tracking-wider ${
                        r.payment_status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {r.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">
                      {r.amount_paid || 0}
                    </td>
                    <td className="px-4 py-2.5 font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Link href={`/admin/workshops/${workshopId}/registrations/${r.id}`} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">
                        View
                      </Link>
                      {r.registration_status === 'pending' && (
                        <form action={async (): Promise<void> => { await updateRegistrationStatus(r.id, workshopId, 'confirmed') }}>
                          <button type="submit" className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#4b5563] hover:text-white transition-colors">
                            Confirm
                          </button>
                        </form>
                      )}
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
