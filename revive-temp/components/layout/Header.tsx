'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/lib/supabase/client'
import { MobileNav } from './MobileNav'
import { SiteLogo } from '@/components/ui/SiteLogo'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/programs', label: 'Programs' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/membership', label: 'Membership' },
  { href: '/trainers', label: 'Trainers' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

type AuthUser = {
  name: string | null
  email: string
  isAdmin: boolean
}

export function Header({ logoUrl = null }: { logoUrl?: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Auth state
  useEffect(() => {
    const supabase = createClient()

    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, is_active')
          .eq('id', user.id)
          .single()

        const isAdmin = !!(profile?.is_active)
        const displayName = profile?.full_name ?? user.user_metadata?.full_name ?? null

        setAuthUser({ name: displayName, email: user.email ?? '', isAdmin })
      } else {
        setAuthUser(null)
      }
      setAuthLoading(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSession()
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setAuthUser(null)
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  const getInitials = (name: string | null, email: string) => {
    if (name?.trim()) {
      return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email ? email[0].toUpperCase() : 'U'
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[60px] md:h-[72px] transition-all duration-400 ${
          scrolled
            ? 'bg-[#0E0C10]/96 backdrop-blur-md border-b border-white/[0.07]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex justify-between items-center h-full max-w-[1320px] mx-auto px-5 md:px-12">

          {/* Logo */}
          <span className="block md:hidden">
            <SiteLogo logoUrl={logoUrl} size="sm" />
          </span>
          <span className="hidden md:block">
            <SiteLogo logoUrl={logoUrl} size="md" />
          </span>

          {/* Desktop Nav — clean minimal links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative font-[family-name:var(--font-body)] text-[13px] font-medium tracking-[0.04em] transition-all duration-200 pb-1 ${
                    isActive
                      ? 'text-[#FCFDFD]'
                      : 'text-[#A0A0A8] hover:text-[#FCFDFD]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/60"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">

            {/* Primary CTA — white pill */}
            <Link
              href="/book-trial"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[13px] font-bold tracking-[0.08em] uppercase px-5 py-2 bg-[#FCFDFD] text-[#0E0C10] hover:bg-white hover:-translate-y-[1px] transition-all duration-200 active:scale-95 rounded-[2px] shrink-0"
            >
              Book a Trial
            </Link>

            {/* Auth area */}
            {authLoading ? (
              <div className="w-8 h-8 bg-white/5 animate-pulse rounded-full" />
            ) : authUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 group"
                  aria-label="Account menu"
                  aria-expanded={dropdownOpen}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#461123] flex items-center justify-center relative">
                    <span className="font-[family-name:var(--font-body)] text-xs font-bold text-[#ffd5df]">
                      {getInitials(authUser.name, authUser.email)}
                    </span>
                    {authUser.isAdmin && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#0E0C10]" />
                    )}
                  </div>
                  <svg
                    className={`w-3 h-3 text-[#A0A0A8] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      key="auth-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-3 w-56 bg-[#121116] border border-white/[0.08] shadow-2xl z-50"
                    >
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="font-[family-name:var(--font-body)] text-sm font-bold text-[#FCFDFD] truncate">
                        {authUser.name ?? 'My Account'}
                      </p>
                      <p className="font-[family-name:var(--font-body)] text-xs text-[#707078] truncate mt-0.5">
                        {authUser.email}
                      </p>
                    </div>

                    {authUser.isAdmin && (
                      <div className="border-b border-white/[0.06]">
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[#A0A0A8] hover:text-[#FCFDFD] hover:bg-white/[0.04] transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                          </svg>
                          <span className="font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.06em] uppercase">
                            Admin Panel
                          </span>
                        </Link>
                      </div>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[#707078] hover:text-[#ef4444] hover:bg-[#ef4444]/5 transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      <span className="font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.06em] uppercase">
                        Sign Out
                      </span>
                    </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="font-[family-name:var(--font-body)] text-[13px] font-medium tracking-[0.04em] text-[#A0A0A8] hover:text-[#FCFDFD] transition-colors px-3 py-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-[#FCFDFD] p-2 -mr-1 hover:opacity-70 transition-opacity"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        currentPath={pathname}
        authUser={authUser}
        onLogout={handleLogout}
      />
    </>
  )
}
