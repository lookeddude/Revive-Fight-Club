import { cn } from '@/lib/utils'

type TrialStatus = 'pending' | 'pending_payment' | 'contacted' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
type EnquiryStatus = 'new' | 'contacted' | 'resolved' | 'spam'
type ContentStatus = 'published' | 'draft' | 'active' | 'inactive'

type Status = TrialStatus | EnquiryStatus | ContentStatus

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  // Trial statuses
  pending:         { label: 'Pending',         classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  pending_payment: { label: 'Awaiting Payment', classes: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  contacted:       { label: 'Contacted',        classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  confirmed:       { label: 'Confirmed',        classes: 'bg-green-500/10 text-green-400 border border-green-500/20' },
  completed:       { label: 'Completed',        classes: 'bg-[#ff571a]/10 text-[#ff571a] border border-[#ff571a]/20' },
  cancelled:       { label: 'Cancelled',        classes: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  no_show:         { label: 'No Show',          classes: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' },
  // Enquiry statuses
  new:      { label: 'New',      classes: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  resolved: { label: 'Resolved', classes: 'bg-green-500/10 text-green-400 border border-green-500/20' },
  spam:     { label: 'Spam',     classes: 'bg-red-500/10 text-red-400 border border-red-500/20' },
  // Content statuses
  published: { label: 'Published', classes: 'bg-green-500/10 text-green-400 border border-green-500/20' },
  draft:     { label: 'Draft',     classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  active:    { label: 'Active',    classes: 'bg-green-500/10 text-green-400 border border-green-500/20' },
  inactive:  { label: 'Inactive',  classes: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' },
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, classes: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'font-[family-name:var(--font-body)] text-sm font-semibold uppercase tracking-wider',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  )
}
