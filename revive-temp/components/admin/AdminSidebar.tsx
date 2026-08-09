'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { AdminRole } from '@/lib/auth/roles'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

type NavSection = {
  title: string
  /** If undefined, all roles can see this section */
  roles?: AdminRole[]
  items: NavItem[]
}

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const TrialIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const EnquiryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const ProgramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const TrainerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const ScheduleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const MemberIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const ReviewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const FAQIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const FacilityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const GalleryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
)
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
)
const ImageMgmtIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    <circle cx="9" cy="9" r="1.5"/><polyline points="20 14 15 9 9 14"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const LogsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

const NAV_SECTIONS: NavSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <DashboardIcon /> },
    ],
  },
  {
    title: 'Leads',
    items: [
      { label: 'Trial Requests', href: '/admin/trials', icon: <TrialIcon /> },
      { label: 'Enquiries', href: '/admin/enquiries', icon: <EnquiryIcon /> },
    ],
  },
  {
    title: 'Content',
    roles: ['superadmin', 'admin', 'manager'],
    items: [
      { label: 'Programs', href: '/admin/programs', icon: <ProgramIcon /> },
      { label: 'Trainers', href: '/admin/trainers', icon: <TrainerIcon /> },
      { label: 'Schedule', href: '/admin/schedule', icon: <ScheduleIcon /> },
      { label: 'Memberships', href: '/admin/memberships', icon: <MemberIcon /> },
      { label: 'Reviews', href: '/admin/reviews', icon: <ReviewIcon /> },
      { label: 'FAQs', href: '/admin/faqs', icon: <FAQIcon /> },
      { label: 'Facilities', href: '/admin/facilities', icon: <FacilityIcon /> },
      { label: 'Gallery', href: '/admin/gallery', icon: <GalleryIcon /> },
      { label: 'Image Management', href: '/admin/images', icon: <ImageMgmtIcon /> },
    ],
  },
  {
    title: 'Settings',
    roles: ['superadmin', 'admin', 'manager'],
    items: [
      { label: 'Business Info', href: '/admin/settings', icon: <SettingsIcon /> },
    ],
  },
  {
    title: 'Team',
    roles: ['superadmin', 'admin'],
    items: [
      { label: 'User Management', href: '/admin/users', icon: <UsersIcon /> },
    ],
  },
  {
    title: 'Audit',
    roles: ['superadmin'],
    items: [
      { label: 'Activity Logs', href: '/admin/logs', icon: <LogsIcon /> },
    ],
  },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  role: AdminRole
}

export function AdminSidebar({ isOpen, onClose, role }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-60 flex flex-col',
          'bg-[#0d0f0e] border-r border-white/[0.06]',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
          <div className="w-7 h-7 bg-[#ff571a] flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-xs">RFC</span>
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-sm leading-none uppercase tracking-tight">
              Revive FC
            </p>
            <p className="text-[10px] text-[#6b7280] mt-0.5 font-[family-name:var(--font-inter)] uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_SECTIONS.filter(section => !section.roles || section.roles.includes(role)).map((section, si) => (
            <div key={si} className={si > 0 ? 'mt-6' : ''}>
              {section.title && (
                <p className="px-2 mb-2 text-[10px] font-bold tracking-[0.12em] uppercase text-[#4b5563] font-[family-name:var(--font-inter)]">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-none transition-colors duration-150',
                        'font-[family-name:var(--font-inter)]',
                        isActive(item.href)
                          ? 'bg-[#ff571a]/10 text-[#ff571a] border-l-2 border-[#ff571a]'
                          : 'text-[#9ca3af] hover:text-[#e2e3e1] hover:bg-white/[0.04] border-l-2 border-transparent'
                      )}
                    >
                      <span className={isActive(item.href) ? 'text-[#ff571a]' : 'text-[#6b7280]'}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <p className="text-[10px] text-[#4b5563] font-[family-name:var(--font-inter)]">
            Revive Fight Club © 2025
          </p>
        </div>
      </aside>
    </>
  )
}
