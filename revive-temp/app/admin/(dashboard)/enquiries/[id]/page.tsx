import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEnquiryById } from '@/lib/data/admin/enquiries'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { EnquiryDetailActions } from './EnquiryDetailActions'

export const metadata: Metadata = { title: 'Enquiry Detail' }

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-white/[0.06] last:border-0">
      <span className="font-[family-name:var(--font-inter)] text-[11px] font-bold uppercase tracking-wider text-[#6b7280] sm:w-36 flex-shrink-0">{label}</span>
      <span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">{value}</span>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const enquiry = await getEnquiryById(id)
  if (!enquiry) notFound()

  const waUrl = enquiry.phone
    ? `https://wa.me/${enquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${enquiry.name}, this is Revive Fight Club regarding your enquiry.`)}`
    : null

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/enquiries" className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs text-[#6b7280] hover:text-[#9ca3af] transition-colors uppercase tracking-wider">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Enquiries
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">{enquiry.name}</h2>
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-1">{enquiry.subject}</p>
        </div>
        <StatusBadge status={enquiry.status} className="mt-1" />
      </div>

      <div className="flex flex-wrap gap-3">
        {enquiry.phone && (
          <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-2 border border-white/[0.08] px-4 py-2 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] hover:border-white/20 hover:text-[#e2e3e1] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.68 3.4 2 2 0 0 1 3.67 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 7.45 7.45l1.01-.59a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call
          </a>
        )}
        {waUrl && (
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/[0.08] px-4 py-2 font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] hover:border-white/20 hover:text-[#e2e3e1] transition-colors">
            WhatsApp
          </a>
        )}
      </div>

      <div className="bg-[#111312] border border-white/[0.08] px-5 py-1">
        <DetailRow label="Name" value={enquiry.name} />
        <DetailRow label="Email" value={<a href={`mailto:${enquiry.email}`} className="text-[#ff571a] hover:text-white transition-colors">{enquiry.email}</a>} />
        <DetailRow label="Phone" value={enquiry.phone || '—'} />
        <DetailRow label="Subject" value={enquiry.subject} />
        <DetailRow label="Message" value={<span className="whitespace-pre-wrap">{enquiry.message}</span>} />
        <DetailRow label="Submitted" value={formatDate(enquiry.created_at)} />
        <DetailRow label="Last Updated" value={formatDate(enquiry.updated_at)} />
      </div>

      <EnquiryDetailActions
        id={enquiry.id}
        currentStatus={enquiry.status}
        currentNotes={enquiry.admin_notes ?? ''}
      />
    </div>
  )
}
