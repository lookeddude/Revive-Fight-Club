'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navLinks: { href: string; label: string }[]
  currentPath: string
}

export function MobileNav({ isOpen, onClose, navLinks, currentPath }: MobileNavProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      closeButtonRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-[#0d0f0e] border-l border-white/10 flex flex-col md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center h-20 px-6 border-b border-white/10">
          <span className="font-[family-name:var(--font-outfit)] text-lg font-bold text-[#e2e3e1] tracking-tighter">
            REVIVE FIGHT CLUB
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-[#e2e3e1] hover:text-[#ffb59e] transition-colors p-2"
            aria-label="Close navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col px-6 py-8 gap-1" aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase py-4 border-b border-white/5 transition-colors duration-200 ${
                  isActive ? 'text-[#ffb59e]' : 'text-[#e2e3e1] hover:text-[#ffb59e]'
                }`}
                onClick={onClose}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile CTA */}
        <div className="px-6 pb-8 pt-4 border-t border-white/10">
          <Link
            href="/book-trial"
            className="block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 text-center"
            onClick={onClose}
          >
            BOOK A TRIAL
          </Link>
        </div>
      </div>
    </>
  )
}
