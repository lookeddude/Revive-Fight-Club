import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardMetrics } from '@/lib/data/admin/dashboard'

export const metadata: Metadata = { title: 'Dashboard' }
export const revalidate = 60

function AlertCard({ label, value, href, note }: { label: string; value: number; href: string; note?: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between p-4 transition-all duration-200"
      style={{
        background: '#1a110d',
        border: '1px solid rgba(255,87,26,0.5)',
      }}
    >
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#ff571a' }}
            aria-hidden="true"
          />
          <p className="font-[family-name:var(--font-body)] text-sm font-black uppercase  text-[#ff571a]">{label}</p>
        </div>
        {note && <p className="font-[family-name:var(--font-body)] text-xs mt-0.5" style={{ color: 'rgba(255,87,26,0.5)' }}>{note}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span
          className="font-[family-name:var(--font-outfit)] font-black"
          style={{ fontSize: '40px', lineHeight: 1, letterSpacing: '-0.04em', color: '#ff571a' }}
        >
          {value}
        </span>
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          style={{ color: 'rgba(255,87,26,0.5)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="square" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

function StatCard({ label, value, href, sub }: { label: string; value: number; href?: string; sub?: string }) {
  const inner = (
    <div
      className="group p-4 flex flex-col gap-1.5 transition-colors duration-200 hover:bg-white/[0.02]"
      style={{
        background: '#111412',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span
        className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em]"
        style={{ color: 'rgba(255,255,255,0.25)' }}
      >
        {label}
      </span>
      <span
        className="font-[family-name:var(--font-outfit)] font-black"
        style={{ fontSize: '28px', lineHeight: 1, letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.85)' }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="font-[family-name:var(--font-body)] text-xs"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          {sub}
        </span>
      )}

    </div>
  )
  if (href) return <Link href={href} className="block">{inner}</Link>
  return inner
}

function SectionHeading({ children, href, linkLabel }: { children: React.ReactNode; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-px h-4" style={{ background: 'rgba(255,87,26,0.5)' }} aria-hidden="true" />
        <h3
          className="font-[family-name:var(--font-body)] text-sm font-black uppercase tracking-[0.15em]"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {children}
        </h3>
      </div>
      {href && (
        <Link
          href={href}
          className="font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider transition-colors hover:text-white"
          style={{ color: 'rgba(255,87,26,0.7)' }}
        >
          {linkLabel ?? 'View all →'}
        </Link>
      )}
    </div>
  )
}

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics()
  const hasPendingTrials = metrics.trials.pending > 0
  const hasNewEnquiries = metrics.enquiries.new > 0
  const hasAlerts = hasPendingTrials || hasNewEnquiries

  return (
    <div className="max-w-5xl space-y-10">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p
            className="font-[family-name:var(--font-body)] text-xs font-black uppercase tracking-[0.22em] mb-1"
            style={{ color: 'rgba(255,87,26,0.7)' }}
          >
            Overview
          </p>
          <h2
            className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase tracking-[-0.03em] leading-none"
            style={{ fontSize: '28px' }}
          >
            Dashboard
          </h2>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"
            aria-hidden="true"
          />
          <span
            className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            Live
          </span>
        </div>
      </div>

      {/* ALERTS */}
      {hasAlerts && (
        <section>
          <SectionHeading>Needs Attention</SectionHeading>
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

      {/* TRIALS */}
      <section>
        <SectionHeading href="/admin/trials" linkLabel="View all →">Trial Requests</SectionHeading>
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

      {/* ENQUIRIES */}
      <section>
        <SectionHeading href="/admin/enquiries" linkLabel="View all →">Contact Enquiries</SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatCard label="Total" value={metrics.enquiries.total} href="/admin/enquiries" />
          <StatCard label="New" value={metrics.enquiries.new} href="/admin/enquiries?status=new" />
          <StatCard label="Contacted" value={metrics.enquiries.contacted} href="/admin/enquiries?status=contacted" />
          <StatCard label="Resolved" value={metrics.enquiries.resolved} href="/admin/enquiries?status=resolved" />
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <SectionHeading>Content Status</SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <StatCard label="Programs" value={metrics.content.active_programs} href="/admin/programs" />
          <StatCard label="Trainers" value={metrics.content.active_trainers} href="/admin/trainers" />
          <StatCard label="Sessions" value={metrics.content.active_schedule_items} href="/admin/schedule" />
          <StatCard label="Plans" value={metrics.content.active_membership_plans} href="/admin/memberships" />
          <StatCard label="Reviews" value={metrics.content.published_reviews} href="/admin/reviews" />
          <StatCard label="FAQs" value={metrics.content.published_faqs} href="/admin/faqs" />
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
        <SectionHeading>Quick Actions</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Pending Trials', href: '/admin/trials?status=pending' },
            { label: 'New Enquiries', href: '/admin/enquiries?status=new' },
            { label: 'Add Program', href: '/admin/programs/new' },
            { label: 'Add Trainer', href: '/admin/trainers/new' },
            { label: 'Business Info', href: '/admin/settings' },
            { label: 'Manage Images', href: '/admin/images' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="group font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-wider px-4 py-2 transition-all duration-200"
              style={{
                color: 'rgba(255,255,255,0.35)',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
