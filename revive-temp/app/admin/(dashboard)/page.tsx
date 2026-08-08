import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardMetrics } from '@/lib/data/admin/dashboard'

export const metadata: Metadata = { title: 'Dashboard' }
export const revalidate = 60

function AlertCard({ label, value, href, note }: { label: string; value: number; href: string; note?: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-4 border transition-all duration-200 hover:border-[#ff571a]/60" style={{ background: 'linear-gradient(135deg, rgba(255,87,26,0.08) 0%, rgba(17,19,18,1) 100%)', border: '1px solid rgba(255,87,26,0.3)' }}>
      <div>
        <p className="font-[family-name:var(--font-inter)] text-[11px] font-bold uppercase tracking-wider text-[#ff571a]">{label}</p>
        {note && <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b5040] mt-0.5">{note}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-[family-name:var(--font-outfit)] font-black text-4xl text-[#ff571a]">{value}</span>
        <svg className="w-4 h-4 text-[#ff571a]/50 group-hover:text-[#ff571a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
      </div>
    </Link>
  )
}

function StatCard({ label, value, href, sub }: { label: string; value: number; href?: string; sub?: string }) {
  const inner = (
    <div className="p-4 border border-white/[0.07] bg-[#111312] flex flex-col gap-1 hover:border-white/15 transition-colors">
      <span className="font-[family-name:var(--font-inter)] text-[11px] font-medium text-[#4b5563] uppercase tracking-wider">{label}</span>
      <span className="font-[family-name:var(--font-outfit)] font-bold text-2xl text-[#e2e3e1]">{value}</span>
      {sub && <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563]">{sub}</span>}
    </div>
  )
  if (href) return <Link href={href} className="block">{inner}</Link>
  return inner
}

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics()
  const hasPendingTrials = metrics.trials.pending > 0
  const hasNewEnquiries = metrics.enquiries.new > 0
  const hasAlerts = hasPendingTrials || hasNewEnquiries

  return (
    <div className="max-w-5xl space-y-8">
      {/* Page header */}
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] text-xl uppercase tracking-tight">Dashboard</h2>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#4b5563] mt-1">Revive Fight Club — management overview.</p>
      </div>

      {/* ── ALERTS — needs attention ────────────────────────── */}
      {hasAlerts && (
        <section>
          <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.15em] text-[#ff571a] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ff571a] rounded-full animate-pulse" />
            Needs Attention
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hasPendingTrials && (
              <AlertCard
                label="Pending Trial Requests"
                value={metrics.trials.pending}
                href="/admin/trials?status=pending"
                note="Awaiting your response"
              />
            )}
            {hasNewEnquiries && (
              <AlertCard
                label="New Enquiries"
                value={metrics.enquiries.new}
                href="/admin/enquiries?status=new"
                note="Haven't been contacted yet"
              />
            )}
          </div>
        </section>
      )}

      {/* ── TRIALS ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#6b7280]">Trial Requests</h3>
          <Link href="/admin/trials" className="font-[family-name:var(--font-inter)] text-xs text-[#ff571a] hover:text-white transition-colors uppercase tracking-wider">View all →</Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-2">
          <StatCard label="Today" value={metrics.trials.today} />
          <StatCard label="This Week" value={metrics.trials.this_week} />
          <StatCard label="This Month" value={metrics.trials.this_month} />
          <StatCard label="Confirmed" value={metrics.trials.confirmed} href="/admin/trials?status=confirmed" />
          <StatCard label="Completed" value={metrics.trials.completed} href="/admin/trials?status=completed" />
          <StatCard label="Total" value={metrics.trials.total} href="/admin/trials" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatCard label="Contacted" value={metrics.trials.contacted} href="/admin/trials?status=contacted" />
          <StatCard label="Cancelled" value={metrics.trials.cancelled} href="/admin/trials?status=cancelled" />
          <StatCard label="No Show" value={metrics.trials.no_show} href="/admin/trials?status=no_show" />
          <StatCard label="Pending" value={metrics.trials.pending} href="/admin/trials?status=pending" />
        </div>
      </section>

      {/* ── ENQUIRIES ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#6b7280]">Contact Enquiries</h3>
          <Link href="/admin/enquiries" className="font-[family-name:var(--font-inter)] text-xs text-[#ff571a] hover:text-white transition-colors uppercase tracking-wider">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatCard label="Total" value={metrics.enquiries.total} href="/admin/enquiries" />
          <StatCard label="New" value={metrics.enquiries.new} href="/admin/enquiries?status=new" />
          <StatCard label="Contacted" value={metrics.enquiries.contacted} href="/admin/enquiries?status=contacted" />
          <StatCard label="Resolved" value={metrics.enquiries.resolved} href="/admin/enquiries?status=resolved" />
        </div>
      </section>

      {/* ── CONTENT STATUS ─────────────────────────────────── */}
      <section>
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-3">Content</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <StatCard label="Programs" value={metrics.content.active_programs} href="/admin/programs" />
          <StatCard label="Trainers" value={metrics.content.active_trainers} href="/admin/trainers" />
          <StatCard label="Sessions" value={metrics.content.active_schedule_items} href="/admin/schedule" />
          <StatCard label="Plans" value={metrics.content.active_membership_plans} href="/admin/memberships" />
          <StatCard label="Reviews" value={metrics.content.published_reviews} href="/admin/reviews" />
          <StatCard label="FAQs" value={metrics.content.published_faqs} href="/admin/faqs" />
        </div>
      </section>

      {/* ── QUICK ACTIONS ──────────────────────────────────── */}
      <section className="border-t border-white/[0.06] pt-6">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'View Pending Trials', href: '/admin/trials?status=pending' },
            { label: 'New Enquiries', href: '/admin/enquiries?status=new' },
            { label: 'Add Program', href: '/admin/programs/new' },
            { label: 'Add Trainer', href: '/admin/trainers/new' },
            { label: 'Business Info', href: '/admin/settings' },
            { label: 'Manage Images', href: '/admin/images' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] border border-white/[0.07] px-4 py-2 hover:border-white/20 hover:text-[#e2e3e1] transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
