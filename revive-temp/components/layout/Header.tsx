'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MobileNav } from './MobileNav'
import { SiteLogo } from '@/components/ui/SiteLogo'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/programs', label: 'Programs' },
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
    const handleScroll = () => setScrolled(window.scrollY > 10)
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

  // Auth state — check user + whether they are admin
  useEffect(() => {
    const supabase = createClient()

    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if they have an active admin profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, is_active')
          .eq('id', user.id)
          .single()

        const isAdmin = !!(profile?.is_active)
        const displayName = profile?.full_name
          ?? user.user_metadata?.full_name
          ?? null

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

  // Get initials for avatar
  const getInitials = (name: string | null, email: string) => {
    if (name?.trim()) {
      return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email ? email[0].toUpperCase() : 'U'
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-14 md:h-20 transition-all duration-300 ${
          scrolled ? 'bg-[#0d0c0b]/98 backdrop-blur-sm' : 'bg-[#0d0c0b]'
        } border-b border-white/10`}
      >
        <div className="flex justify-between items-center h-full max-w-[1280px] mx-auto pl-1.5 pr-4 md:pl-[27px] md:pr-16">

          {/* Logo — sm on mobile (h-14=56px), md on desktop (h-20=80px) */}
          <span className="block md:hidden">
            <SiteLogo logoUrl={logoUrl} size="sm" />
          </span>
          <span className="hidden md:block">
            <SiteLogo logoUrl={logoUrl} size="md" />
          </span>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 ml-8" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.08em] uppercase transition-colors duration-200 ${
                    isActive
                      ? 'text-[#ffb59e] border-b border-[#ffb59e] pb-1'
                      : 'text-[#f0ede8] hover:text-[#ff571a]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">

            {/* Book Trial CTA — skewed parallelogram with glow */}
            <Link
              href="/book-trial"
              className="relative inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-[11px] font-black tracking-[0.14em] uppercase transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0 group"
              style={{
                background: 'linear-gradient(135deg, #ff571a 0%, #d94418 100%)',
                color: '#000',
                padding: '10px 22px',
                clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                boxShadow: '0 0 18px rgba(255,87,26,0.45), 0 0 36px rgba(255,87,26,0.2)',
                animation: 'navGlow 2.5s ease-in-out infinite',
              }}
            >
              {/* Lightning bolt icon */}
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              BOOK A TRIAL
            </Link>

            {/* Auth area */}
            {authLoading ? (
              <div className="w-9 h-9 bg-white/5 animate-pulse rounded-full" />
            ) : authUser ? (
              /* Logged in — show avatar dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 group"
                  aria-label="Account menu"
                  aria-expanded={dropdownOpen}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#ff571a] flex items-center justify-center relative">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-bold text-black">
                      {getInitials(authUser.name, authUser.email)}
                    </span>
                    {/* Admin indicator dot */}
                    {authUser.isAdmin && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#121413]" />
                    )}
                  </div>
                  <svg
                    className={`w-3 h-3 text-[#6b7280] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-[#111312] border border-white/10 shadow-xl z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="font-[family-name:var(--font-inter)] text-sm font-bold text-[#e2e3e1] truncate">
                        {authUser.name ?? 'My Account'}
                      </p>
                      <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563] truncate mt-0.5">
                        {authUser.email}
                      </p>
                    </div>

                    {/* Admin Panel — only if admin */}
                    {authUser.isAdmin && (
                      <div className="border-b border-white/8">
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[#ff571a] hover:bg-[#ff571a]/10 transition-colors group"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                          </svg>
                          <span className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.08em] uppercase">
                            Admin Panel
                          </span>
                        </Link>
                      </div>
                    )}

                    {/* Sign out */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[#6b7280] hover:text-[#ef4444] hover:bg-[#ef4444]/5 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      <span className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.08em] uppercase">
                        Sign Out
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in */
              <Link
                href="/login"
                className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#f0ede8] hover:text-[#ff571a] transition-colors px-3 py-3"
              >
                LOGIN
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-[#f0ede8] hover:text-[#ff571a] transition-colors p-2"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
