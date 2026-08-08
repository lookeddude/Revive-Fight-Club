'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MobileNav } from './MobileNav'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/programs', label: 'Programs' },
  { href: '/trainers', label: 'Trainers' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/membership', label: 'Membership' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

type AdminUser = {
  name: string | null
  email: string
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

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
  }, [pathname])

  // Check admin auth state
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

        if (profile?.is_active) {
          setAdminUser({
            name: profile.full_name,
            email: user.email ?? '',
          })
        } else {
          setAdminUser(null)
        }
      } else {
        setAdminUser(null)
      }
      setAuthLoading(false)
    }

    checkSession()

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSession()
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setAdminUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
          scrolled ? 'bg-[#121413]/98 backdrop-blur-sm' : 'bg-[#121413]'
        } border-b border-white/10`}
      >
        <div className="flex justify-between items-center h-full max-w-[1280px] mx-auto px-5 md:px-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-[#e2e3e1] tracking-tighter hover:opacity-80 transition-opacity active:scale-95"
          >
            REVIVE FIGHT CLUB
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase transition-colors duration-200 ${
                    isActive
                      ? 'text-[#ffb59e] border-b border-[#ffb59e] pb-1'
                      : 'text-[#e2e3e1] hover:text-[#ffb59e]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!authLoading && (
              <>
                {adminUser ? (
                  /* Admin is logged in — show Admin Panel + Logout */
                  <div className="flex items-center gap-3">
                    {/* Admin greeting */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#1e201f] border border-white/10 rounded-none">
                      <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                      <span className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.08em] uppercase text-[#9ca3af]">
                        {adminUser.name ?? 'Admin'}
                      </span>
                    </div>
                    {/* Admin Panel button */}
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-5 py-3 hover:bg-white transition-all duration-300 active:scale-95"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                      </svg>
                      ADMIN PANEL
                    </Link>
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#6b7280] hover:text-[#ef4444] transition-colors duration-200 px-2 py-3"
                      aria-label="Sign out of admin"
                    >
                      SIGN OUT
                    </button>
                  </div>
                ) : (
                  /* Not logged in — show Book Trial + Login */
                  <div className="flex items-center gap-3">
                    <Link
                      href="/admin/login"
                      className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#6b7280] hover:text-[#9ca3af] transition-colors duration-200 px-2 py-3 border border-white/10 hover:border-white/20"
                    >
                      STAFF LOGIN
                    </Link>
                    <Link
                      href="/book-trial"
                      className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 active:scale-95"
                    >
                      BOOK A TRIAL
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Loading skeleton */}
            {authLoading && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-24 bg-white/5 animate-pulse" />
                <div className="h-10 w-32 bg-[#ff571a]/20 animate-pulse" />
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-[#e2e3e1] hover:text-[#ffb59e] transition-colors p-2"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
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
        adminUser={adminUser}
        onLogout={handleLogout}
      />
    </>
  )
}
