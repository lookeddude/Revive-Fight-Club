import Link from 'next/link'
import { getBusinessSettings, getActivePrograms } from '@/lib/data/content'
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/business'

const navLinks = [
  { href: '/programs', label: 'Programs' },
  { href: '/trainers', label: 'Trainers' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/membership', label: 'Membership' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/reviews', label: 'Reviews' },
]

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
]

export async function Footer() {
  const [settings, programs] = await Promise.all([
    getBusinessSettings(),
    getActivePrograms(),
  ])

  const whatsappUrl = buildWhatsAppUrl(
    settings?.whatsapp_number ?? null,
    WHATSAPP_MESSAGES.general
  )

  const socialLinks = [
    settings?.instagram_url && {
      href: settings.instagram_url, label: 'Instagram',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    },
    settings?.facebook_url && {
      href: settings.facebook_url, label: 'Facebook',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    },
    settings?.youtube_url && {
      href: settings.youtube_url, label: 'YouTube',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  return (
    <footer className="relative overflow-hidden" style={{ background: '#080706' }}>

      {/* ── Top CTA Banner ─────────────────────────────────── */}
      <div
        className="relative py-10 md:py-14 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,87,26,0.12) 0%, rgba(8,7,6,1) 60%)', borderTop: '1px solid rgba(255,87,26,0.2)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        {/* Decorative large text */}
        <span
          className="absolute -right-4 top-1/2 -translate-y-1/2 font-[family-name:var(--font-outfit)] font-black uppercase select-none pointer-events-none hidden md:block"
          style={{ fontSize: '120px', lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px rgba(255,87,26,0.08)', letterSpacing: '-0.04em' }}
          aria-hidden="true"
        >RFC</span>

        <div className="max-w-[1280px] mx-auto px-5 md:px-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] font-black tracking-[0.2em] uppercase text-[#ff571a] mb-2">
              Start Today
            </p>
            <h2
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase leading-[0.92] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
            >
              READY TO <span className="text-[#ff571a]">FIGHT</span>?
            </h2>
          </div>
          <Link
            href="/book-trial"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs font-black tracking-[0.16em] uppercase px-8 py-4 text-black transition-all duration-300 hover:scale-[1.03] active:scale-95 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #ff571a, #e03020)', boxShadow: '0 4px 24px rgba(255,87,26,0.4)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            BOOK A FREE TRIAL
          </Link>
        </div>
      </div>

      {/* ── Main Footer Body ───────────────────────────────── */}
      <div className="relative">
        {/* Subtle diagonal texture */}
        <div className="absolute inset-0 bg-stripes opacity-40 pointer-events-none" aria-hidden="true" />
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 10% 50%, rgba(255,87,26,0.04) 0%, transparent 60%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">

            {/* ── Brand + Location + Review ─── col-span-4 */}
            <div className="md:col-span-4 flex flex-col gap-6">

              {/* Logo */}
              <Link
                href="/"
                className="font-[family-name:var(--font-outfit)] font-black uppercase block hover:opacity-80 transition-opacity w-fit"
                style={{ fontSize: 'clamp(18px, 2.2vw, 22px)', letterSpacing: '-0.04em' }}
              >
                <span className="text-[#f5f2ed]">REVIVE </span>
                <span className="text-[#ff571a]">FIGHT </span>
                <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(245,242,237,0.35)' }}>CLUB</span>
              </Link>

              {/* Dynamic tagline with live program names */}
              <p className="font-[family-name:var(--font-inter)] text-[12px] text-[#5a5450] leading-relaxed -mt-3 max-w-[260px]">
                Bengaluru&apos;s premier combat sports gym.{' '}
                {(programs ?? []).length > 0 && (
                  <>
                    {programs.slice(0, -1).map(p => p.name).join(', ')}
                    {programs.length > 1 ? ` & ${programs[programs.length - 1].name}` : programs[0].name}.
                  </>
                )}
              </p>

              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-px bg-[#ff571a]" aria-hidden="true" />
                  <p className="font-[family-name:var(--font-inter)] text-[9px] font-black tracking-[0.22em] uppercase text-[#ff571a]">Location</p>
                </div>
                <a
                  href="https://maps.app.goo.gl/HDkr8hrYK1Tuop7G6?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Revive Fight Club location in Google Maps"
                  className="group inline-flex items-start gap-2.5 mb-3"
                >
                  <svg className="w-3.5 h-3.5 text-[#ff571a] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="font-[family-name:var(--font-inter)] text-[12px] text-[#6a6460] leading-snug group-hover:text-[#a8a49f] transition-colors">
                    3rd floor, 157, MM Road,<br />
                    Fraser Town, Bengaluru,<br />
                    Karnataka 560005
                  </span>
                </a>
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-[12px] text-[#5a5450] hover:text-[#e2e3e1] transition-colors w-fit"
                    aria-label={`Call ${settings.phone}`}
                  >
                    <svg className="w-3 h-3 text-[#ff571a]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    {settings.phone}
                  </a>
                )}
              </div>


            </div>

            {/* ── Navigation ─────── col-span-3 */}
            <div className="md:col-span-3 md:col-start-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-px bg-[#ff571a]" aria-hidden="true" />
                <h4 className="font-[family-name:var(--font-inter)] text-[9px] font-black tracking-[0.22em] uppercase text-[#ff571a]">
                  Navigation
                </h4>
              </div>
              <ul className="flex flex-col gap-0">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 py-1.5 font-[family-name:var(--font-inter)] text-[13px] text-[#5a5450] hover:text-[#e2e3e1] transition-colors"
                    >
                      <span className="w-0 h-px bg-[#ff571a] group-hover:w-4 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Social + Legal ──── col-span-3 */}
            <div className="md:col-span-3 md:col-start-10 flex flex-col gap-8">

              {/* Social */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-px bg-[#ff571a]" aria-hidden="true" />
                  <h4 className="font-[family-name:var(--font-inter)] text-[9px] font-black tracking-[0.22em] uppercase text-[#ff571a]">
                    Connect
                  </h4>
                </div>
                {socialLinks.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="group flex items-center gap-3 font-[family-name:var(--font-inter)] text-[13px] text-[#5a5450] hover:text-[#e2e3e1] transition-colors w-fit"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Revive Fight Club on ${link.label}`}
                      >
                        <span className="w-7 h-7 flex items-center justify-center transition-all duration-300 group-hover:text-[#ff571a]" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                          {link.icon}
                        </span>
                        {link.label}
                      </a>
                    ))}
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        className="group flex items-center gap-3 font-[family-name:var(--font-inter)] text-[13px] text-[#5a5450] hover:text-[#25D366] transition-colors w-fit"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Revive Fight Club on WhatsApp"
                      >
                        <span className="w-7 h-7 flex items-center justify-center transition-all duration-300 group-hover:border-[#25D366]/40 group-hover:text-[#25D366]" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </span>
                        WhatsApp
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#3a3530]">Coming soon</p>
                )}
              </div>

              {/* Legal */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-px bg-[#ff571a]" aria-hidden="true" />
                  <h4 className="font-[family-name:var(--font-inter)] text-[9px] font-black tracking-[0.22em] uppercase text-[#ff571a]">
                    Legal
                  </h4>
                </div>
                <ul className="flex flex-col gap-2">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-[family-name:var(--font-inter)] text-[12px] text-[#3a3835] hover:text-[#8a8079] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-[family-name:var(--font-inter)] text-[10px] text-[#2a2825] tracking-[0.1em] uppercase">
            © {new Date().getFullYear()} Revive Fight Club. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="font-[family-name:var(--font-inter)] text-[10px] text-[#2a2825] hover:text-[#6b6059] transition-colors tracking-[0.08em]"
                aria-label={`Email us at ${settings.email}`}
              >
                {settings.email}
              </a>
            )}
            <span className="text-[#1a1815] text-[10px]">·</span>
            <span className="font-[family-name:var(--font-inter)] text-[10px] text-[#1e1c1a]">
              Bengaluru, Karnataka
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}
