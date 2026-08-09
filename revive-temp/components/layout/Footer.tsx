import Link from 'next/link'
import { getBusinessSettings } from '@/lib/data/content'
import { buildWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/business'

const navLinks = [
  { href: '/programs', label: 'Programs' },
  { href: '/trainers', label: 'Trainers' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/membership', label: 'Membership' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
]

export async function Footer() {
  const settings = await getBusinessSettings()

  const whatsappUrl = buildWhatsAppUrl(
    settings?.whatsapp_number ?? null,
    WHATSAPP_MESSAGES.general
  )

  const socialLinks = [
    settings?.instagram_url && { href: settings.instagram_url, label: 'Instagram' },
    settings?.facebook_url && { href: settings.facebook_url, label: 'Facebook' },
    settings?.youtube_url && { href: settings.youtube_url, label: 'YouTube' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <footer
      className="text-[#e2e3e1] pt-16 pb-8 relative overflow-hidden"
      style={{ background: '#0a0908' }}
    >
      {/* Top orange accent line */}
      <div className="sep-orange" aria-hidden="true" />

      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-stripes opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-16">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-[family-name:var(--font-outfit)] font-black uppercase tracking-tight block mb-5 hover:opacity-80 transition-opacity"
              style={{ fontSize: 'clamp(16px, 2vw, 20px)', letterSpacing: '-0.03em' }}
            >
              <span className="text-[#f5f2ed]">REVIVE </span>
              <span className="text-[#ff571a]">FIGHT </span>
              <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(245,242,237,0.4)' }}>CLUB</span>
            </Link>

            {/* Location */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-px bg-[#ff571a]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#ff571a]">
                Our Location
              </p>
            </div>

            <a
              href="https://maps.app.goo.gl/HDkr8hrYK1Tuop7G6?g_st=ac"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Revive Fight Club location in Google Maps"
              className="group inline-flex items-start gap-2.5 mb-4 opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4 text-[#ff571a] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="font-[family-name:var(--font-inter)] text-[13px] text-[#8a8079] leading-snug group-hover:text-[#c8c6c5] transition-colors">
                3rd floor, 157, MM Road,<br />
                Fraser Town, Bengaluru,<br />
                Karnataka 560005
              </span>
            </a>

            {settings?.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="font-[family-name:var(--font-inter)] text-sm text-[#8a8079] hover:text-[#e2e3e1] block transition-colors"
                aria-label={`Call ${settings.phone}`}
              >
                {settings.phone}
              </a>
            )}
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#ff571a] mb-5">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-inter)] text-sm text-[#6b6059] hover:text-[#e2e3e1] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#ff571a] mb-5">
              Social
            </h4>
            {socialLinks.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-[family-name:var(--font-inter)] text-sm text-[#6b6059] hover:text-[#e2e3e1] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Revive Fight Club on ${link.label}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {whatsappUrl && (
                  <li>
                    <a
                      href={whatsappUrl}
                      className="font-[family-name:var(--font-inter)] text-sm text-[#6b6059] hover:text-[#25D366] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Revive Fight Club on WhatsApp"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#3a3530]">Coming soon</p>
            )}
          </div>

          {/* Legal + CTA */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#ff571a] mb-5">
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5 mb-8">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-inter)] text-sm text-[#6b6059] hover:text-[#e2e3e1] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/book-trial"
              className="btn-primary"
              style={{ fontSize: '11px', padding: '12px 24px' }}
            >
              BOOK A TRIAL
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-[family-name:var(--font-inter)] text-[11px] text-[#3a3530] tracking-[0.08em]">
            © {new Date().getFullYear()} REVIVE FIGHT CLUB. ALL RIGHTS RESERVED.
          </p>
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="font-[family-name:var(--font-inter)] text-[11px] text-[#3a3530] hover:text-[#8a8079] transition-colors tracking-[0.08em]"
              aria-label={`Email us at ${settings.email}`}
            >
              {settings.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
