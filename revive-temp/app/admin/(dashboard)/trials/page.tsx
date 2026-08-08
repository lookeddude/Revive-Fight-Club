import type { Metadata } from 'next'
import Link from 'next/link'
import { getTrials } from '@/lib/data/admin/trials'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { EmptyState } from '@/components/admin/EmptyState'
import { TrialFilters } from './TrialFilters'

export const metadata: Metadata = { title: 'Trial Requests' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default async function TrialsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const status = params.status ?? 'all'
  const search = params.search ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  const { data: trials, count } = await getTrials({ status, search, page, pageSize: 20 })

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Trial Requests</h2>
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-0.5">{count} total request{count !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <TrialFilters currentStatus={status} currentSearch={search} />

      {trials.length === 0 ? (
        <EmptyState
          title={search || status !== 'all' ? 'No results found' : 'No trial requests yet'}
          description={search || status !== 'all' ? 'Try adjusting your filters.' : 'When someone submits a trial request, it will appear here.'}
        />
      ) : (
        <div className="bg-[#111312] border border-white/[0.08]">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Name', 'Phone', 'Program', 'Preferred Date', 'Status', 'Submitted', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trials.map(trial => (
                  <tr key={trial.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#e2e3e1]">{trial.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`tel:${trial.phone}`} className="font-[family-name:var(--font-inter)] text-sm text-[#9ca3af] hover:text-[#ff571a] transition-colors">{trial.phone}</a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-inter)] text-sm text-[#9ca3af]">{trial.programs?.name ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-inter)] text-sm text-[#9ca3af]">
                        {trial.preferred_date ? formatDate(trial.preferred_date) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={trial.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">{formatDate(trial.created_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/trials/${trial.id}`}
                        className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/[0.04]">
            {trials.map(trial => (
              <Link key={trial.id} href={`/admin/trials/${trial.id}`} className="block p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#e2e3e1]">{trial.name}</span>
                  <StatusBadge status={trial.status} />
                </div>
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#9ca3af]">{trial.phone}</p>
                {trial.programs?.name && <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] mt-1">{trial.programs.name}</p>}
                <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563] mt-1">{formatDate(trial.created_at)}</p>
              </Link>
            ))}
          </div>

          <AdminPagination total={count} page={page} pageSize={20} />
        </div>
      )}
    </div>
  )
}
