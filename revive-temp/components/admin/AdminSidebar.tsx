'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { AdminRole } from '@/lib/auth/roles'
import Image from 'next/image'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

type NavSection = {
  title: string
  roles?: AdminRole[]
  items: NavItem[]
}

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const TrialIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const EnquiryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const ProgramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const TrainerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const ScheduleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const MemberIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const ReviewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const FAQIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const FacilityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const GalleryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
)
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
)
const ImageMgmtIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    <circle cx="9" cy="9" r="1.5"/><polyline points="20 14 15 9 9 14"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const LogsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-60 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{
          background: 'linear-gradient(180deg, #0f1110 0%, #0b0d0c 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Logo in white container so white-bg PNG looks clean on dark sidebar */}
          <div className="bg-white px-2 py-1 rounded-sm flex items-center justify-center" style={{ minWidth: 72 }}>
            <Image src="/images/rfc-logo.png" alt="RFC" width={72} height={29} className="object-contain" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-black text-[#e8e4df] text-sm uppercase tracking-tight leading-none">
              Admin Panel
            </p>
            <p className="font-[family-name:var(--font-inter)] text-[9px] font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: 'rgba(255,87,26,0.7)' }}>
              Revive Fight Club
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2" style={{ scrollbarWidth: 'none' }}>
          {NAV_SECTIONS.filter(section => !section.roles || section.roles.includes(role)).map((section, si) => (
            <div key={si} className={si > 0 ? 'mt-5' : ''}>
              {section.title && (
                <p
                  className="px-3 mb-1.5 font-[family-name:var(--font-inter)] text-[9px] font-black tracking-[0.2em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'group flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-all duration-150 relative',
                          'font-[family-name:var(--font-inter)]',
                        )}
                        style={active ? {
                          background: 'linear-gradient(90deg, rgba(255,87,26,0.12) 0%, rgba(255,87,26,0.04) 100%)',
                          color: '#ff571a',
                          borderLeft: '2px solid #ff571a',
                          paddingLeft: '10px',
                        } : {
                          color: 'rgba(255,255,255,0.38)',
                          borderLeft: '2px solid transparent',
                          paddingLeft: '10px',
                        }}
                      >
                        {/* Hover bg via pseudo approach — use inline style on hover via CSS */}
                        <span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={!active ? { background: 'rgba(255,255,255,0.03)' } : {}}
                          aria-hidden="true"
                        />
                        <span
                          className="relative z-10 flex-shrink-0 transition-colors"
                          style={{ color: active ? '#ff571a' : 'rgba(255,255,255,0.25)' }}
                        >
                          {item.icon}
                        </span>
                        <span
                          className="relative z-10 transition-colors group-hover:text-[#e2e3e1]"
                          style={{ color: active ? '#ff571a' : 'rgba(255,255,255,0.38)' }}
                        >
                          {item.label}
                        </span>
                        {/* Active indicator dot */}
                        {active && (
                          <span
                            className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: '#ff571a' }}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer — view site link */}
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 w-full"
          >
            <span className="font-[family-name:var(--font-inter)] text-[11px] transition-colors group-hover:text-[#e2e3e1]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              View website
            </span>
            <svg className="w-3 h-3 transition-colors" style={{ color: 'rgba(255,255,255,0.15)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </aside>
    </>
  )
}
