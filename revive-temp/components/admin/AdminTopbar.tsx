'use client'

import { adminLogout } from '@/lib/actions/admin/authActions'
import type { AdminProfile } from '@/lib/auth/getAdminSession'

interface AdminTopbarProps {
  title: string
  profile: AdminProfile
  onMenuToggle: () => void
}

export function AdminTopbar({ title, profile, onMenuToggle }: AdminTopbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] bg-[#0d0f0e] flex-shrink-0">
      {/* Left: menu + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-[#9ca3af] hover:text-[#e2e3e1] transition-colors p-1"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <h1 className="font-[family-name:var(--font-inter)] font-semibold text-[#e2e3e1] text-sm">
          {title}
        </h1>
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-[family-name:var(--font-inter)] text-xs font-medium text-[#e2e3e1] leading-none">
            {profile.full_name ?? profile.email}
          </span>
          <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#6b7280] uppercase tracking-wider mt-0.5">
            {profile.role}
          </span>
        </div>
        <div className="w-8 h-8 bg-[#ff571a]/20 border border-[#ff571a]/30 flex items-center justify-center">
          <span className="font-[family-name:var(--font-inter)] text-xs font-bold text-[#ff571a]">
            {(profile.full_name ?? profile.email).charAt(0).toUpperCase()}
          </span>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] hover:text-[#e2e3e1] transition-colors"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  )
}
