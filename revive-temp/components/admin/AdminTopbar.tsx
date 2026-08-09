'use client'

import { adminLogout } from '@/lib/actions/admin/authActions'
import type { AdminProfile } from '@/lib/auth/getAdminSession'

interface AdminTopbarProps {
  title: string
  profile: AdminProfile
  onMenuToggle: () => void
}

export function AdminTopbar({ title, profile, onMenuToggle }: AdminTopbarProps) {
  const initials = (profile.full_name ?? profile.email)
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const roleColor: Record<string, string> = {
    superadmin: '#ff571a',
    admin: '#f59e0b',
    manager: '#3b82f6',
    staff: '#6b7280',
  }
  const dotColor = roleColor[profile.role] ?? '#6b7280'

  return (
    <header
      className="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0"
      style={{
        background: 'linear-gradient(180deg, #0f1110 0%, #0c0e0d 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 1px 0 rgba(255,87,26,0.04)',
      }}
    >
      {/* Left: menu toggle + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 transition-colors rounded-sm"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <span
            className="font-[family-name:var(--font-inter)] text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ color: 'rgba(255,87,26,0.7)' }}
          >
            RFC
          </span>
          <span style={{ color: 'rgba(255,255,255,0.12)' }} aria-hidden="true">/</span>
          <h1
            className="font-[family-name:var(--font-inter)] font-semibold text-sm"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Right: user card + logout */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
            aria-hidden="true"
          />
          <span
            className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: dotColor, opacity: 0.8 }}
          >
            {profile.role}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4" style={{ background: 'rgba(255,255,255,0.08)' }} aria-hidden="true" />

        {/* User */}
        <div className="hidden sm:flex flex-col items-end gap-0">
          <span
            className="font-[family-name:var(--font-inter)] text-[12px] font-semibold leading-none"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {profile.full_name ?? profile.email.split('@')[0]}
          </span>
          <span
            className="font-[family-name:var(--font-inter)] text-[10px] leading-none mt-0.5"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            {profile.email}
          </span>
        </div>

        {/* Avatar */}
        <div
          className="w-8 h-8 flex items-center justify-center flex-shrink-0 select-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,87,26,0.25), rgba(255,87,26,0.08))',
            border: '1px solid rgba(255,87,26,0.3)',
          }}
          aria-hidden="true"
        >
          <span className="font-[family-name:var(--font-inter)] text-[11px] font-black text-[#ff571a]">
            {initials}
          </span>
        </div>

        {/* Logout */}
        <form action={adminLogout}>
          <button
            type="submit"
            className="group flex items-center gap-1.5 transition-colors"
            style={{ color: 'rgba(255,255,255,0.2)' }}
            aria-label="Sign out"
          >
            <svg
              className="w-4 h-4 group-hover:text-[#e2e3e1] transition-colors"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden md:block font-[family-name:var(--font-inter)] text-[11px] font-bold uppercase tracking-wider group-hover:text-[#e2e3e1] transition-colors">
              Logout
            </span>
          </button>
        </form>
      </div>
    </header>
  )
}
