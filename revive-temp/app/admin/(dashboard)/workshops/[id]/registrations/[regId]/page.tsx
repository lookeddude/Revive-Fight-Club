import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin, getAdminSession } from '@/lib/auth/getAdminSession'
import { adminGetRegistrationById } from '@/lib/data/workshopAdmin'
import { updateRegistrationStatus, markAttendance } from '@/lib/actions/admin/workshopRegistrationActions'

export const metadata: Metadata = { title: 'Registration Detail' }

export default async function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string; regId: string }>
}) {
  await requireAdmin()
  const session = await getAdminSession()
  const { id: workshopId, regId } = await params
  const reg = await adminGetRegistrationById(regId)

  if (!reg) notFound()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'waitlisted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'attended': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'no_show': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'cancelled': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link
          href={`/admin/workshops/${workshopId}/registrations`}
          className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] hover:text-white transition-colors mb-4 inline-block"
        >
          &larr; Back to Registrations
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">
            Registration Detail
          </h2>
          <span
            className={`inline-flex items-center px-3 py-1 border font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider ${getStatusColor(reg.registration_status)}`}
          >
            {reg.registration_status}
          </span>
        </div>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-1">
          ID: {reg.registration_id}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#111312] border border-white/[0.07] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">
            Participant Info
          </h3>
          <div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Name</p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] font-medium">{reg.full_name}</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Email</p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] font-medium">{reg.email}</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Phone</p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] font-medium">{reg.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-[#111312] border border-white/[0.07] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">
            Payment Info
          </h3>
          <div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Status</p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] font-medium uppercase">{reg.payment_status}</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Amount Paid</p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] font-medium">
              {reg.amount_paid ? `₹${reg.amount_paid.toLocaleString('en-IN')}` : '—'}
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Registered On</p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] font-medium">
              {new Date(reg.created_at).toLocaleString()}
            </p>
          </div>
          {reg.attendance_marked_at && (
            <div>
              <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Attended At</p>
              <p className="font-[family-name:var(--font-body)] text-sm text-blue-400 font-medium">
                {new Date(reg.attendance_marked_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {Object.keys(reg.custom_answers || {}).length > 0 && (
        <div className="bg-[#111312] border border-white/[0.07] p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">
            Custom Answers
          </h3>
          <div className="space-y-3">
            {Object.entries(reg.custom_answers).map(([key, value]) => (
              <div key={key}>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">{key}</p>
                <p className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1] font-medium">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#111312] border border-white/[0.07] p-5 space-y-2">
        <h3 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm uppercase tracking-wider border-b border-white/[0.07] pb-2">
          QR Token
        </h3>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280]">Token (for QR check-in)</p>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#e2e3e1] font-mono bg-white/[0.02] p-2 border border-white/[0.07] break-all">
          {reg.qr_token}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        {reg.registration_status !== 'attended' && (
          <form
            action={async () => {
              'use server'
              await markAttendance(reg.id, workshopId, session?.id ?? '', 'attended')
            }}
          >
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
            >
              Mark Attended
            </button>
          </form>
        )}
        {reg.registration_status !== 'confirmed' && (
          <form
            action={async () => {
              'use server'
              await updateRegistrationStatus(reg.id, workshopId, 'confirmed')
            }}
          >
            <button
              type="submit"
              className="px-5 py-2.5 border border-white/[0.07] text-[#e2e3e1] font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Confirm
            </button>
          </form>
        )}
        {reg.registration_status !== 'cancelled' && (
          <form
            action={async () => {
              'use server'
              await updateRegistrationStatus(reg.id, workshopId, 'cancelled')
            }}
          >
            <button
              type="submit"
              className="px-5 py-2.5 border border-red-500/30 text-red-400 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors"
            >
              Cancel Registration
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
