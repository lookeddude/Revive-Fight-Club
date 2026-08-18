import type { Metadata } from 'next'
import Link from 'next/link'
import { getEnquiries } from '@/lib/data/admin/enquiries'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { EmptyState } from '@/components/admin/EmptyState'
import { EnquiryFilters } from './EnquiryFilters'

export const metadata: Metadata = { title: 'Enquiries' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const status = params.status ?? 'all'
  const search = params.search ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  const { data: enquiries, count } = await getEnquiries({ status, search, page, pageSize: 20 })

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Contact Enquiries</h2>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-0.5">{count} total enquir{count !== 1 ? 'ies' : 'y'}</p>
        </div>
      </div>

      <EnquiryFilters currentStatus={status} currentSearch={search} />

      {enquiries.length === 0 ? (
        <EmptyState
          title={search || status !== 'all' ? 'No results found' : 'No enquiries yet'}
          description={search || status !== 'all' ? 'Try adjusting your filters.' : 'When someone submits a contact form, it will appear here.'}
        />
      ) : (
        <div className="bg-[#111312] border border-white/[0.08]">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Name', 'Email', 'Subject', 'Status', 'Submitted', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#6b7280]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{e.name}</span>
                      {e.phone && <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-0.5">{e.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af]">{e.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-body)] text-sm text-[#9ca3af] line-clamp-1 max-w-[200px] block">{e.subject}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">{formatDate(e.created_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/enquiries/${e.id}`} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#ff571a] hover:text-white transition-colors">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-white/[0.04]">
            {enquiries.map(e => (
              <Link key={e.id} href={`/admin/enquiries/${e.id}`} className="block p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[#e2e3e1]">{e.name}</span>
                  <StatusBadge status={e.status} />
                </div>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#9ca3af]">{e.email}</p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] mt-1 line-clamp-1">{e.subject}</p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563] mt-1">{formatDate(e.created_at)}</p>
              </Link>
            ))}
          </div>

          <AdminPagination total={count} page={page} pageSize={20} />
        </div>
      )}
    </div>
  )
}
