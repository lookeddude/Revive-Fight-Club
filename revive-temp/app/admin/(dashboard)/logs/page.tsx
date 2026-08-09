import { requireSuperAdmin } from '@/lib/auth/getAdminSession'
import { getActivityLogs } from '@/lib/actions/admin/activityLog'
import { AdminShell } from '@/components/admin/AdminShell'
import { LogsClient } from '@/components/admin/LogsClient'
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

const ACTION_STAT_COLORS: Record<ActionType, string> = {
  login: 'text-emerald-400',
  logout: 'text-gray-400',
  invite_sent: 'text-blue-400',
  invite_revoked: 'text-amber-400',
  user_activated: 'text-emerald-400',
  user_deactivated: 'text-amber-400',
  user_deleted: 'text-red-400',
  content_created: 'text-blue-400',
  content_updated: 'text-purple-400',
  content_deleted: 'text-red-400',
  settings_updated: 'text-purple-400',
  trial_updated: 'text-[#ff571a]',
  enquiry_updated: 'text-[#ff571a]',
}

export default async function ActivityLogsPage() {
  const profile = await requireSuperAdmin()
  const logs = await getActivityLogs(300)
  const statTypes: ActionType[] = ['login', 'user_deleted', 'invite_sent', 'content_updated']

  return (
    <AdminShell title="Activity Logs" profile={profile}>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl uppercase tracking-tight">
              Activity Logs
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-1">
              Full audit trail. Visible to superadmin only.
            </p>
          </div>
          <div className="text-right">
            <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280]">
              {logs.length} recent entries
            </p>
            <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] mt-0.5">
              Times shown in IST (UTC+5:30)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {statTypes.map((type) => {
            const count = logs.filter(l => l.action_type === type).length
            return (
              <div key={type} className="border border-white/[0.08] p-4 bg-white/[0.01]">
                <p className={`text-[10px] font-bold tracking-[0.12em] uppercase font-[family-name:var(--font-inter)] mb-1 ${ACTION_STAT_COLORS[type]}`}>
                  {ACTION_LABELS[type]}
                </p>
                <p className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl">{count}</p>
              </div>
            )
          })}
        </div>

        <LogsClient logs={logs} />
      </div>
    </AdminShell>
  )
}
