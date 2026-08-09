'use client'

import { useState } from 'react'
import type { ActivityLog, ActionType } from '@/lib/actions/admin/activityLog'

const ACTION_LABELS: Record<string, string> = {
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

const ACTION_COLORS: Record<string, string> = {
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

const IST_OPTIONS = { timeZone: 'Asia/Kolkata' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    ...IST_OPTIONS,
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    ...IST_OPTIONS,
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })
}

function formatFull(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    ...IST_OPTIONS,
    weekday: 'long',
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })
}

function DeviceIcon({ deviceType }: { deviceType?: string }) {
  if (deviceType === 'Mobile') return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
  if (deviceType === 'Tablet') return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" strokeWidth="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
      <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
      <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
    </svg>
  )
}

interface Props {
  logs: ActivityLog[]
}

export function LogsClient({ logs }: Props) {
  const [selected, setSelected] = useState<ActivityLog | null>(null)

  // Group by IST date
  const grouped: Record<string, ActivityLog[]> = {}
  for (const log of logs) {
    const date = formatDate(log.created_at)
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(log)
  }

  const meta = (log: ActivityLog) => (log.metadata ?? {}) as Record<string, string>

  return (
    <>
      {logs.length === 0 ? (
        <div className="border border-white/[0.08] p-12 text-center">
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280]">
            No activity recorded yet.
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
                  <button
                    key={log.id}
                    onClick={() => setSelected(log)}
                    className="w-full flex items-start gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left group cursor-pointer"
                  >
                    {/* Time (IST) */}
                    <div className="shrink-0 w-[95px]">
                      <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] tabular-nums">
                        {formatTime(log.created_at)}
                      </p>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#4b5563] mt-0.5">IST</p>
                    </div>

                    {/* Action badge */}
                    <div className="shrink-0 w-[130px] pt-0.5">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] uppercase border font-[family-name:var(--font-inter)] ${
                        ACTION_COLORS[log.action_type] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {ACTION_LABELS[log.action_type] ?? log.action_type}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="flex-1 min-w-0">
                      <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] leading-relaxed">
                        {log.description}
                      </p>
                      {/* Device pill for login */}
                      {log.action_type === 'login' && meta(log).browser && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[#6b7280]"><DeviceIcon deviceType={meta(log).deviceType} /></span>
                          <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b7280]">
                            {meta(log).browser} on {meta(log).os} ({meta(log).deviceType})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actor + open arrow */}
                    <div className="shrink-0 text-right hidden md:flex flex-col items-end gap-1">
                      <p className={`font-[family-name:var(--font-inter)] text-xs font-bold ${
                        ROLE_COLORS[log.actor_role] ?? 'text-[#9ca3af]'
                      }`}>
                        {log.actor_role.toUpperCase()}
                      </p>
                      <p className="font-[family-name:var(--font-inter)] text-[11px] text-[#6b7280] max-w-[180px] truncate">
                        {log.actor_email}
                      </p>
                    </div>

                    {/* Open detail chevron */}
                    <div className="shrink-0 flex items-center self-center text-[#4b5563] group-hover:text-[#ff571a] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="square" strokeWidth={2} d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg bg-[#111312] border border-white/10 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] uppercase border font-[family-name:var(--font-inter)] ${
                  ACTION_COLORS[selected.action_type] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {ACTION_LABELS[selected.action_type] ?? selected.action_type}
                </span>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-lg uppercase tracking-tight">
                  Log Detail
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-[#6b7280] hover:text-[#e2e3e1] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={2} d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">

              {/* Full timestamp */}
              <div className="bg-white/[0.02] border border-white/[0.06] p-4">
                <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#6b7280] mb-1">Date &amp; Time (IST)</p>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] font-medium">
                  {formatFull(selected.created_at)}
                </p>
              </div>

              {/* Actor */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.02] border border-white/[0.06] p-4">
                  <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#6b7280] mb-1">Performed By</p>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] break-all">{selected.actor_email}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] p-4">
                  <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#6b7280] mb-1">Role</p>
                  <p className={`font-[family-name:var(--font-inter)] text-sm font-bold uppercase ${ROLE_COLORS[selected.actor_role] ?? 'text-[#9ca3af]'}`}>
                    {selected.actor_role}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/[0.02] border border-white/[0.06] p-4">
                <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#6b7280] mb-1">Description</p>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">{selected.description}</p>
                {selected.action_target && (
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] mt-1">Target: {selected.action_target}</p>
                )}
              </div>

              {/* Device info (login events) */}
              {selected.action_type === 'login' && meta(selected).browser && (
                <div className="bg-white/[0.02] border border-white/[0.06] p-4">
                  <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#6b7280] mb-3">Device Info</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b7280] mb-0.5">Browser</p>
                      <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] font-medium">{meta(selected).browser ?? '—'}</p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b7280] mb-0.5">OS</p>
                      <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] font-medium">{meta(selected).os ?? '—'}</p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b7280] mb-0.5">Device</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#9ca3af]"><DeviceIcon deviceType={meta(selected).deviceType} /></span>
                        <p className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1] font-medium">{meta(selected).deviceType ?? '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional metadata */}
              {Object.keys(selected.metadata ?? {}).filter(k => !['browser','os','deviceType','userAgent'].includes(k)).length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.06] p-4">
                  <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#6b7280] mb-2">Additional Info</p>
                  <pre className="font-mono text-xs text-[#9ca3af] whitespace-pre-wrap break-all">
                    {JSON.stringify(
                      Object.fromEntries(
                        Object.entries(selected.metadata ?? {}).filter(([k]) => !['browser','os','deviceType','userAgent'].includes(k))
                      ),
                      null, 2
                    )}
                  </pre>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.01]">
              <button
                onClick={() => setSelected(null)}
                className="w-full border border-white/10 text-[#9ca3af] font-[family-name:var(--font-inter)] text-sm font-bold uppercase py-2 hover:text-[#e2e3e1] hover:border-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
