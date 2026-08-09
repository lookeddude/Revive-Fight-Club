'use client'

import { useState, useTransition } from 'react'
import { createInvitation, revokeInvitation, updateStaffStatus } from '@/lib/actions/admin/invitations'
import { invitableRoles, canInvite, type AdminRole } from '@/lib/auth/roles'
import type { AdminProfile } from '@/lib/auth/getAdminSession'
import type { Invitation, StaffMember } from '@/lib/actions/admin/invitations'

const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  receptionist: 'Receptionist',
}

const ROLE_COLORS: Record<AdminRole, string> = {
  superadmin: 'bg-[#ff571a]/20 text-[#ff571a] border-[#ff571a]/30',
  admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  manager: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  receptionist: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const STATUS_COLORS = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  expired: 'bg-red-500/20 text-red-400 border-red-500/30',
}

function RoleBadge({ role }: { role: AdminRole }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-[0.1em] uppercase border font-[family-name:var(--font-inter)] ${ROLE_COLORS[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  )
}

function StatusBadge({ status }: { status: 'pending' | 'accepted' | 'expired' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-[0.1em] uppercase border font-[family-name:var(--font-inter)] ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  )
}

interface Props {
  currentProfile: AdminProfile
  staff: StaffMember[]
  invitations: Invitation[]
}

export function UserManagementClient({ currentProfile, staff, invitations }: Props) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<AdminRole>('receptionist')
  const [inviteResult, setInviteResult] = useState<{ token: string; alreadyExisted: boolean } | null>(null)
  const [inviteError, setInviteError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)
  const [actionError, setActionError] = useState('')

  const allowedRoles = invitableRoles(currentProfile.role)
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://revivefightclub.com'

  function getInviteUrl(token: string) {
    return `${siteUrl}/invite/${token}`
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(getInviteUrl(token)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleInvite() {
    setInviteError('')
    setInviteResult(null)
    startTransition(async () => {
      const result = await createInvitation(inviteEmail, inviteRole)
      if (result.success) {
        setInviteResult({ token: result.token, alreadyExisted: result.alreadyExisted })
        setInviteEmail('')
      } else {
        setInviteError(result.error)
      }
    })
  }

  function handleRevoke(id: string) {
    setActionError('')
    startTransition(async () => {
      const result = await revokeInvitation(id)
      if (!result.success) setActionError(result.error ?? 'Failed to revoke.')
    })
  }

  function handleToggleStatus(profileId: string, current: boolean) {
    setActionError('')
    startTransition(async () => {
      const result = await updateStaffStatus(profileId, !current)
      if (!result.success) setActionError(result.error ?? 'Failed to update status.')
    })
  }

  const pendingInvites = invitations.filter(i => i.status === 'pending')
  const pastInvites = invitations.filter(i => i.status !== 'pending')

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl uppercase tracking-tight">
            User Management
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-1">
            Manage staff access and send invitations.
          </p>
        </div>
        {canInvite(currentProfile.role) && (
          <button
            onClick={() => { setShowInviteModal(true); setInviteResult(null); setInviteError('') }}
            className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase px-5 py-2.5 hover:bg-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeWidth={2} d="M12 5v14M5 12h14" />
            </svg>
            Invite User
          </button>
        )}
      </div>

      {actionError && (
        <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-[family-name:var(--font-inter)]">
          {actionError}
        </div>
      )}

      {/* Current Staff */}
      <section className="mb-10">
        <h2 className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.15em] uppercase text-[#6b7280] mb-4">
          Current Staff ({staff.length})
        </h2>
        <div className="border border-white/[0.08] overflow-hidden">
          {staff.length === 0 ? (
            <p className="p-6 text-sm text-[#6b7280] font-[family-name:var(--font-inter)]">No staff members found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Name</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Email</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Role</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Status</th>
                  {canInvite(currentProfile.role) && (
                    <th className="px-4 py-3 text-right text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">
                        {member.full_name ?? '—'}
                        {member.id === currentProfile.id && (
                          <span className="ml-2 text-[10px] text-[#6b7280]">(you)</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7]">{member.email || '—'}</span>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={member.role} /></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold tracking-[0.1em] uppercase border font-[family-name:var(--font-inter)] ${
                        member.is_active
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {canInvite(currentProfile.role) && (
                      <td className="px-4 py-3 text-right">
                        {member.id !== currentProfile.id && member.role !== 'superadmin' && (
                          <button
                            onClick={() => handleToggleStatus(member.id, member.is_active)}
                            disabled={isPending}
                            className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.08em] uppercase text-[#6b7280] hover:text-[#e2e3e1] transition-colors disabled:opacity-40"
                          >
                            {member.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Pending Invitations */}
      {canInvite(currentProfile.role) && (
        <section className="mb-10">
          <h2 className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.15em] uppercase text-[#6b7280] mb-4">
            Pending Invitations ({pendingInvites.length})
          </h2>
          <div className="border border-white/[0.08] overflow-hidden">
            {pendingInvites.length === 0 ? (
              <p className="p-6 text-sm text-[#6b7280] font-[family-name:var(--font-inter)]">No pending invitations.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Email</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Role</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Expires</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Status</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvites.map((inv) => (
                    <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-[family-name:var(--font-inter)] text-sm text-[#e2e3e1]">{inv.email}</span>
                      </td>
                      <td className="px-4 py-3"><RoleBadge role={inv.role} /></td>
                      <td className="px-4 py-3">
                        <span className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7]">
                          {new Date(inv.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => copyLink(inv.id)}
                            className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.08em] uppercase text-[#ff571a] hover:text-white transition-colors"
                            title="Copy invite link"
                          >
                            Copy Link
                          </button>
                          <button
                            onClick={() => handleRevoke(inv.id)}
                            disabled={isPending}
                            className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.08em] uppercase text-[#6b7280] hover:text-red-400 transition-colors disabled:opacity-40"
                          >
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Past Invitations */}
      {canInvite(currentProfile.role) && pastInvites.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.15em] uppercase text-[#6b7280] mb-4">
            Past Invitations
          </h2>
          <div className="border border-white/[0.08] overflow-hidden opacity-60">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Email</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Role</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Date</th>
                </tr>
              </thead>
              <tbody>
                {pastInvites.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/[0.04]">
                    <td className="px-4 py-3"><span className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7]">{inv.email}</span></td>
                    <td className="px-4 py-3"><RoleBadge role={inv.role} /></td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3">
                      <span className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280]">
                        {new Date(inv.accepted_at ?? inv.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md bg-[#111312] border border-white/10 p-6">
            {inviteResult ? (
              /* Success state */
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#ff571a] flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase">
                    {inviteResult.alreadyExisted ? 'Role Applied!' : 'Invitation Created!'}
                  </h2>
                </div>

                {inviteResult.alreadyExisted ? (
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7] mb-6">
                    This user already had an account. Their role has been updated immediately — no link needed.
                  </p>
                ) : (
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-sm text-[#bab8b7] mb-4">
                      Share this link with the invited person. It expires in 7 days.
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-white/[0.04] border border-white/10 mb-6">
                      <code className="flex-1 font-mono text-xs text-[#ff571a] break-all">
                        {getInviteUrl(inviteResult.token)}
                      </code>
                      <button
                        onClick={() => copyLink(inviteResult.token)}
                        className="shrink-0 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold uppercase px-3 py-1.5 hover:bg-white transition-colors"
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => { setShowInviteModal(false); setInviteResult(null) }}
                  className="w-full border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm font-bold uppercase px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Invite form */
              <div>
                <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase mb-6">Invite User</h2>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#9ca3af] mb-2">
                      Email Address <span className="text-[#ff571a]">*</span>
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="staff@example.com"
                      className="w-full bg-[#1a1c1b] border border-white/10 px-4 py-2.5 text-sm text-[#e2e3e1] font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#ff571a]/50 placeholder-[#4b5563]"
                    />
                  </div>

                  <div>
                    <label className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#9ca3af] mb-2">
                      Role <span className="text-[#ff571a]">*</span>
                    </label>
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value as AdminRole)}
                      className="w-full bg-[#1a1c1b] border border-white/10 px-4 py-2.5 text-sm text-[#e2e3e1] font-[family-name:var(--font-inter)] focus:outline-none focus:border-[#ff571a]/50 appearance-none"
                    >
                      {allowedRoles.map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </div>

                  {inviteError && (
                    <p className="text-sm text-red-400 font-[family-name:var(--font-inter)]">{inviteError}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleInvite}
                      disabled={isPending || !inviteEmail.trim()}
                      className="flex-1 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase py-2.5 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? 'Sending...' : 'Send Invitation'}
                    </button>
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 border border-white/10 text-[#9ca3af] font-[family-name:var(--font-inter)] text-sm font-bold uppercase hover:text-[#e2e3e1] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
