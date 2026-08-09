import { requireSuperAdmin } from '@/lib/auth/getAdminSession'
import { getActivityLogs } from '@/lib/actions/admin/activityLog'
import { AdminShell } from '@/components/admin/AdminShell'
import type { ActionType } from '@/lib/actions/admin/activityLog'

const ACTION_LABELS: Record<ActionType, string> = {
  login: 'Login',
  logout: 'Logout',
  invite_sent: 'Invite Sent',
  invite_revoked: 'Invite Revoked',
  user_activated: 'User Activated',
  user_deactivated: 'User Deactivated',
  user_deleted: 'User Deleted',
  content_created: 'Content Created',
  content_updated: 'Content Updated',
  content_deleted: 'Content Deleted',
  settings_updated: 'Settings Updated',
  trial_updated: 'Trial Updated',
  enquiry_updated: 'Enquiry Updated',
}

const ACTION_COLORS: Record<ActionType, string> = {
  login: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  logout: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  invite_sent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  invite_revoked: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  user_activated: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  user_deactivated: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  user_deleted: 'bg-red-500/20 text-red-400 border-red-500/30',
  content_created: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  content_updated: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  content_deleted: 'bg-red-500/20 text-red-400 border-red-500/30',
  settings_updated: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  trial_updated: 'bg-[#ff571a]/20 text-[#ff571a] border-[#ff571a]/30',
  enquiry_updated: 'bg-[#ff571a]/20 text-[#ff571a] border-[#ff571a]/30',
}

const ROLE_COLORS: Record<string, string> = {
  superadmin: 'text-[#ff571a]',
  admin: 'text-blue-400',
  manager: 'text-purple-400',
  receptionist: 'text-emerald-400',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })
}

export default async function ActivityLogsPage() {
  const profile = await requireSuperAdmin()
  const logs = await getActivityLogs(300)

  // Group by date
  const grouped: Record<string, typeof logs> = {}
  for (const log of logs) {
    const date = formatDate(log.created_at)
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(log)
  }

  return (
    <AdminShell title="Activity Logs" profile={profile}>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl uppercase tracking-tight">
              Activity Logs
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-1">
              Full audit trail — logins, changes, and actions. Visible to superadmin only.
            </p>
          </div>
          <div className="text-right">
            <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">
              {logs.length} recent entries
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {(['login', 'user_deleted', 'invite_sent', 'content_updated'] as ActionType[]).map((type) => {
            const count = logs.filter(l => l.action_type === type).length
            return (
              <div key={type} className="border border-white/[0.08] p-4 bg-white/[0.01]">
                <p className={`text-[10px] font-bold tracking-[0.12em] uppercase font-[family-name:var(--font-inter)] mb-1 ${ACTION_COLORS[type].split(' ')[1]}`}>
                  {ACTION_LABELS[type]}
                </p>
                <p className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl">{count}</p>
              </div>
            )
          })}
        </div>

        {/* Logs */}
        {logs.length === 0 ? (
          <div className="border border-white/[0.08] p-12 text-center">
            <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280]">
              No activity recorded yet. Logs appear here after admin actions.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([date, dayLogs]) => (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.15em] uppercase text-[#6b7280]">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563]">
                    {dayLogs.length} {dayLogs.length === 1 ? 'event' : 'events'}
                  </span>
                </div>

                {/* Log entries */}
                <div className="border border-white/[0.08] divide-y divide-white/[0.04] overflow-hidden">
                  {dayLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.015] transition-colors group"
                    >
                      {/* Time */}
                      <div className="shrink-0 w-[90px]">
                        <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] tabular-nums">
                          {formatTime(log.created_at)}
                        </p>
                      </div>

                      {/* Action badge */}
                      <div className="shrink-0 w-[130px]">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] uppercase border font-[family-name:var(--font-inter)] ${ACTION_COLORS[log.action_type as ActionType] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                          {ACTION_LABELS[log.action_type as ActionType] ?? log.action_type}
                        </span>
                      </div>

                      {/* Description + actor */}
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] leading-relaxed">
                          {log.description}
                        </p>
                        {log.action_target && (
                          <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] mt-0.5 truncate">
                            Target: {log.action_target}
                          </p>
                        )}
                      </div>

                      {/* Actor */}
                      <div className="shrink-0 text-right hidden md:block">
                        <p className={`font-[family-name:var(--font-inter)] text-xs font-bold ${ROLE_COLORS[log.actor_role] ?? 'text-[#9ca3af]'}`}>
                          {log.actor_role.toUpperCase()}
                        </p>
                        <p className="font-[family-name:var(--font-inter)] text-[11px] text-[#6b7280] mt-0.5 max-w-[180px] truncate">
                          {log.actor_email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
