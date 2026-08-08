import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardMetrics } from '@/lib/data/admin/dashboard'

export const metadata: Metadata = { title: 'Dashboard' }
export const revalidate = 60

function MetricCard({
  label,
  value,
  sub,
  href,
  accent,
}: {
  label: string
  value: number
  sub?: string
  href?: string
  accent?: boolean
}) {
  const inner = (
    <div
      className={`p-4 border ${
        accent ? 'border-[#ff571a]/30 bg-[#ff571a]/5' : 'border-white/[0.08] bg-[#111312]'
      } flex flex-col gap-1`}
    >
      <span className="font-[family-name:var(--font-inter)] text-[11px] font-medium text-[#6b7280] uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`font-[family-name:var(--font-outfit)] font-bold text-3xl ${
          accent ? 'text-[#ff571a]' : 'text-[#e2e3e1]'
        }`}
      >
        {value}
      </span>
      {sub && (
        <span className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563]">{sub}</span>
      )}
    </div>
  )
  if (href) return <Link href={href} className="block hover:opacity-80 transition-opacity">{inner}</Link>
  return inner
}

export default async function AdminDashboard() {
  const metrics = await getDashboardMetrics()

  return (
    <div className="max-w-6xl space-y-8">
      {/* Page header */}
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">
          Dashboard
        </h2>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-1">
          Overview of Revive Fight Club operations.
        </p>
      </div>

      {/* Trials overview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
            Trial Requests
          </h3>
          <Link
            href="/admin/trials"
            className="font-[family-name:var(--font-inter)] text-xs text-[#ff571a] hover:text-white transition-colors uppercase tracking-wider"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <MetricCard label="Total" value={metrics.trials.total} href="/admin/trials" />
          <MetricCard label="Pending" value={metrics.trials.pending} href="/admin/trials?status=pending" accent={metrics.trials.pending > 0} />
          <MetricCard label="Contacted" value={metrics.trials.contacted} href="/admin/trials?status=contacted" />
          <MetricCard label="Confirmed" value={metrics.trials.confirmed} href="/admin/trials?status=confirmed" />
          <MetricCard label="Completed" value={metrics.trials.completed} href="/admin/trials?status=completed" />
          <MetricCard label="Cancelled" value={metrics.trials.cancelled} href="/admin/trials?status=cancelled" />
          <MetricCard label="No Show" value={metrics.trials.no_show} href="/admin/trials?status=no_show" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <MetricCard label="Today" value={metrics.trials.today} />
          <MetricCard label="This Week" value={metrics.trials.this_week} />
          <MetricCard label="This Month" value={metrics.trials.this_month} />
        </div>
      </section>

      {/* Enquiries overview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
            Contact Enquiries
          </h3>
          <Link
            href="/admin/enquiries"
            className="font-[family-name:var(--font-inter)] text-xs text-[#ff571a] hover:text-white transition-colors uppercase tracking-wider"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Total" value={metrics.enquiries.total} href="/admin/enquiries" />
          <MetricCard label="New" value={metrics.enquiries.new} href="/admin/enquiries?status=new" accent={metrics.enquiries.new > 0} />
          <MetricCard label="Contacted" value={metrics.enquiries.contacted} href="/admin/enquiries?status=contacted" />
          <MetricCard label="Resolved" value={metrics.enquiries.resolved} href="/admin/enquiries?status=resolved" />
        </div>
      </section>

      {/* Content overview */}
      <section>
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-3">
          Content Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard label="Programs" value={metrics.content.active_programs} href="/admin/programs" />
          <MetricCard label="Trainers" value={metrics.content.active_trainers} href="/admin/trainers" />
          <MetricCard label="Sessions" value={metrics.content.active_schedule_items} href="/admin/schedule" />
          <MetricCard label="Plans" value={metrics.content.active_membership_plans} href="/admin/memberships" />
          <MetricCard label="Reviews" value={metrics.content.published_reviews} href="/admin/reviews" />
          <MetricCard label="FAQs" value={metrics.content.published_faqs} href="/admin/faqs" />
        </div>
      </section>

      {/* Quick links */}
      <section className="border-t border-white/[0.06] pt-6">
        <h3 className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'View Pending Trials', href: '/admin/trials?status=pending' },
            { label: 'New Enquiries', href: '/admin/enquiries?status=new' },
            { label: 'Add Program', href: '/admin/programs/new' },
            { label: 'Update Business Info', href: '/admin/settings' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] border border-white/[0.08] px-4 py-2 hover:border-white/20 hover:text-[#e2e3e1] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
