import { Navbar } from '@/components/layout/Navbar'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export const revalidate = 0

function statusColor(status: string) {
  const map: Record<string, string> = {
    paid: 'text-green-400 bg-green-400/10 border-green-400/20',
    created: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    failed: 'text-red-400 bg-red-400/10 border-red-400/20',
    cancelled: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    refunded: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  }
  return map[status] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/20'
}

export default async function AdminPaymentsPage() {
  const supabase = createAdminClient()

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[admin/payments]', error)
  }

  const list = payments ?? []

  const totalPaid = list.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const countPaid = list.filter(p => p.status === 'paid').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#f0ede8] font-[family-name:var(--font-outfit)] uppercase tracking-tight">
            Payments
          </h1>
          <p className="text-sm text-[#6b7280] mt-0.5 font-[family-name:var(--font-body)]">
            All payment transactions — read-only view
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Paid', value: `₹${(totalPaid / 100).toLocaleString('en-IN')}`, color: '#22c55e' },
          { label: 'Successful', value: countPaid, color: '#22c55e' },
          { label: 'Memberships', value: list.filter(p => p.payment_type === 'membership' && p.status === 'paid').length, color: '#ff571a' },
          { label: 'Trials', value: list.filter(p => p.payment_type === 'trial' && p.status === 'paid').length, color: '#f5a623' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111210] border border-white/[0.06] p-4">
            <p className="text-xs text-[#6b7280] font-[family-name:var(--font-body)] uppercase tracking-wide mb-1">{stat.label}</p>
            <p className="font-[family-name:var(--font-outfit)] font-black text-xl" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <div className="bg-[#111210] border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-[family-name:var(--font-body)]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Date', 'Customer', 'Type', 'Plan', 'Amount', 'Status', 'Razorpay Order'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#6b7280]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[#6b7280]">
                    No payment records yet
                  </td>
                </tr>
              ) : list.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-[#9ca3af] whitespace-nowrap text-xs">
                    {new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#e2e3e1] font-medium">{p.customer_name}</div>
                    <div className="text-[#6b7280] text-xs">{p.customer_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wide border ${
                      p.payment_type === 'membership' ? 'text-[#ff571a] bg-[#ff571a]/10 border-[#ff571a]/20' : 'text-[#f5a623] bg-[#f5a623]/10 border-[#f5a623]/20'
                    }`}>
                      {p.payment_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af] text-xs">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(p.metadata as any)?.plan_name ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-outfit)] font-bold text-[#f0ede8]">
                    ₹{(p.amount / 100).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase tracking-wide border ${statusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6b7280] text-xs font-mono truncate max-w-[140px]">
                    {p.razorpay_order_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
