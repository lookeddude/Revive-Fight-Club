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

  if (!isOpen && typeof document !== 'undefined') {
    // Keep in DOM for transition but hidden for AT when closed
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    return email[0].toUpperCase()
  }

  return (
    <>
      {/* Backdrop — fades in/out */}
      <div
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm md:hidden"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — slides in from right */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-[#0d0f0e] border-l border-white/10 flex flex-col md:hidden"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center h-20 px-6 border-b border-white/10">
          <span className="font-[family-name:var(--font-outfit)] text-lg font-bold text-[#e2e3e1] tracking-tighter">
            REVIVE FIGHT CLUB
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-[#e2e3e1] hover:text-[#ffb59e] transition-colors p-3 -mr-1"
            aria-label="Close navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info — shown when logged in */}
        {authUser && (
          <div className="px-6 py-4 border-b border-white/8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff571a] flex items-center justify-center flex-shrink-0 relative">
              <span className="font-[family-name:var(--font-body)] text-xs font-bold text-black">
                {getInitials(authUser.name, authUser.email)}
              </span>
              {authUser.isAdmin && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#0d0f0e]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-body)] text-sm font-bold text-[#e2e3e1] truncate">
                {authUser.name ?? 'My Account'}
              </p>
              <p className="font-[family-name:var(--font-body)] text-xs text-[#4b5563] truncate">
                {authUser.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col px-6 py-6 gap-1 overflow-y-auto" aria-label="Mobile navigation">
          {navLinks.map((link, index) => {
            const isActive = currentPath === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase py-4 border-b border-white/5 transition-colors duration-200 ${
                  isActive ? 'text-[#ffb59e]' : 'text-[#e2e3e1] hover:text-[#ffb59e]'
                }`}
                style={{
                  animation: isOpen
                    ? `navLinkIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) ${0.12 + index * 0.05}s both`
                    : 'none',
                }}
                onClick={onClose}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Admin Panel link — only for admins */}
          {authUser?.isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase py-4 border-b border-white/5 text-[#ff571a] hover:text-[#ffb59e] transition-colors"
              style={{
                animation: isOpen
                  ? `navLinkIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) ${0.12 + navLinks.length * 0.05}s both`
                  : 'none',
              }}
              onClick={onClose}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Bottom CTA */}
        <div className="px-6 pb-8 pt-4 border-t border-white/10 flex flex-col gap-3">
          <Link
            href="/book-trial"
            className="block bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 text-center"
            onClick={onClose}
          >
            BOOK A TRIAL
          </Link>

          {authUser ? (
            <button
              onClick={() => { onLogout?.(); onClose() }}
              className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase text-[#6b7280] hover:text-[#ef4444] transition-colors py-2 text-center"
            >
              SIGN OUT
            </button>
          ) : (
            <Link
              href="/login"
              className="block border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-3 hover:border-white/20 transition-all duration-300 text-center"
              onClick={onClose}
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
