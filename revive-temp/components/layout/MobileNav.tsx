'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navLinks: { href: string; label: string }[]
  currentPath: string
  authUser?: { name: string | null; email: string; isAdmin: boolean } | null
  onLogout?: () => void
}

export function MobileNav({ isOpen, onClose, navLinks, currentPath, authUser, onLogout }: MobileNavProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      closeButtonRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    return email[0].toUpperCase()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm md:hidden"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — slides from right */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[340px] flex flex-col md:hidden"
        style={{
          background: '#0E0C10',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.34s cubic-bezier(0.16, 1, 0.3, 1)',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
      >
        {/* Header row */}
        <div className="flex justify-between items-center h-[60px] px-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-[family-name:var(--font-outfit)] text-base font-black text-[#FCFDFD] tracking-[-0.02em] uppercase">
            RFC
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-[#A0A0A8] hover:text-[#FCFDFD] transition-colors p-2 -mr-1"
            aria-label="Close navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info — when logged in */}
        {authUser && (
          <div className="px-6 py-4 flex items-center gap-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-full bg-[#461123] flex items-center justify-center flex-shrink-0 relative">
              <span className="font-[family-name:var(--font-body)] text-xs font-bold text-[#ffd5df]">
                {getInitials(authUser.name, authUser.email)}
              </span>
              {authUser.isAdmin && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#0E0C10]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-body)] text-sm font-bold text-[#FCFDFD] truncate">
                {authUser.name ?? 'My Account'}
              </p>
              <p className="font-[family-name:var(--font-body)] text-xs text-[#707078] truncate">
                {authUser.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col px-6 py-8 gap-0 overflow-y-auto" aria-label="Mobile navigation">
          {navLinks.map((link, index) => {
            const isActive = currentPath === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`font-[family-name:var(--font-body)] text-[15px] font-medium tracking-[0.02em] py-3.5 transition-colors duration-200 ${
                  isActive ? 'text-[#FCFDFD]' : 'text-[#707078] hover:text-[#FCFDFD]'
                }`}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  animation: isOpen
                    ? `navLinkIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.05}s both`
                    : 'none',
                }}
                onClick={onClose}
              >
                {link.label}
              </Link>
            )
          })}

          {authUser?.isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2.5 font-[family-name:var(--font-body)] text-[13px] font-bold tracking-[0.08em] uppercase py-3.5 text-[#707078] hover:text-[#FCFDFD] transition-colors"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              onClick={onClose}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Bottom CTAs */}
        <div className="px-6 pb-8 pt-4 flex flex-col gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            href="/book-trial"
            className="block bg-[#FCFDFD] text-[#0E0C10] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-200 text-center"
            onClick={onClose}
          >
            Claim Free Trial
          </Link>

          {authUser ? (
            <button
              onClick={() => { onLogout?.(); onClose() }}
              className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase text-[#707078] hover:text-[#ef4444] transition-colors py-2 text-center"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="block font-[family-name:var(--font-body)] text-sm font-medium text-[#707078] hover:text-[#FCFDFD] transition-colors py-2 text-center"
              onClick={onClose}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
