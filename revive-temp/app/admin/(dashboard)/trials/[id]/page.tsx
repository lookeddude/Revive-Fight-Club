import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTrialById } from '@/lib/data/admin/trials'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { TrialDetailActions } from './TrialDetailActions'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Trial Request Detail' }

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-4 py-2.5 border-b border-white/[0.06] last:border-0">
      <span className="font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider text-[#6b7280]">{label}</span>
      <span className="font-[family-name:var(--font-body)] text-sm text-[#e2e3e1]">{value}</span>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default async function TrialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const trial = await getTrialById(id)
  if (!trial) notFound()

  const waMessage = encodeURIComponent(`Hi ${trial.name}, this is Revive Fight Club regarding your trial request. We’d love to confirm your spot!`)
  const waUrl = trial.phone ? `https://wa.me/${trial.phone.replace(/\D/g, '')}?text=${waMessage}` : null

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <Link href="/admin/trials" className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors uppercase tracking-wider">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Trials
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">{trial.name}</h2>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-1">Submitted {formatDate(trial.created_at)}</p>
        </div>
        <StatusBadge status={trial.status} className="mt-1" />
      </div>

      {/* Contact actions */}
      <div className="flex flex-wrap gap-3">
        {trial.phone && (
          <a
            href={`tel:${trial.phone}`}
            className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.02] px-4 py-2 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] hover:border-white/20 hover:text-[#e2e3e1] transition-colors"
          >
            Call
          </a>
        )}
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/[0.08] bg-[#25D366]/10 px-4 py-2 font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
          >
            WhatsApp
          </a>
        )}
      </div>


      {/* Details */}
      <div className="bg-[#111312] border border-white/[0.08] px-5 py-1">
        <DetailRow label="Name" value={trial.name} />
        <DetailRow label="Phone" value={<a href={`tel:${trial.phone}`} className="text-[#ff571a] hover:text-white transition-colors">{trial.phone}</a>} />
        <DetailRow label="Email" value={trial.email || '—'} />
        <DetailRow label="Program" value={trial.programs?.name ?? '—'} />
        <DetailRow label="Preferred Date" value={trial.preferred_date ? new Date(trial.preferred_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
        <DetailRow label="Preferred Time" value={trial.preferred_time ?? '—'} />
        <DetailRow label="Message" value={trial.message || '—'} />
        <DetailRow label="Submitted" value={formatDate(trial.created_at)} />
        <DetailRow label="Last Updated" value={formatDate(trial.updated_at)} />
      </div>

      {/* Status + Notes actions */}
      <TrialDetailActions
        id={trial.id}
        currentStatus={trial.status}
        currentNotes={trial.admin_notes ?? ''}
      />
    </div>
  )
}
