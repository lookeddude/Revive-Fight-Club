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
    <footer className="bg-[#0d0f0e] text-[#e2e3e1] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-[#e2e3e1] tracking-tighter block mb-4 hover:opacity-80 transition-opacity"
            >
              REVIVE FIGHT CLUB
            </Link>
            {/* Location label */}
            <div className="flex items-center gap-2 mt-3 mb-2">
              <div className="w-4 h-px bg-[#ff571a]" />
              <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#ff571a]">
                Our Location
              </p>
            </div>

            {/* Google Maps button */}
            <a
              href="https://maps.app.goo.gl/HDkr8hrYK1Tuop7G6?g_st=ac"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Revive Fight Club location in Google Maps"
              className="group inline-flex items-start gap-2.5 mt-1 mb-3 hover:opacity-100 transition-all duration-200"
              style={{ opacity: 0.75 }}
            >
              {/* Pin icon */}
              <svg
                className="w-4 h-4 text-[#ff571a] shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5] leading-snug group-hover:text-[#f0ede8] transition-colors">
                3rd floor, 157, MM Road,<br />
                above Indian Overseas Bank,<br />
                Fraser Town, Bengaluru,<br />
                Karnataka 560005
              </span>
            </a>
            {/* Dynamic phone */}
            {settings?.phone ? (
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="text-[#c8c6c5] text-sm mb-2 opacity-80 hover:opacity-100 hover:text-[#e2e3e1] block transition-colors"
                aria-label={`Call ${settings.phone}`}
              >
                {settings.phone}
              </a>
            ) : null}
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-4">
              Links
            </h4>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#c8c6c5] text-sm hover:text-[#e2e3e1] hover:underline decoration-[#ff571a] underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social — dynamic from Supabase */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-4">
              Social
            </h4>
            {socialLinks.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#c8c6c5] text-sm hover:text-[#e2e3e1] hover:underline decoration-[#ff571a] underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
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
                      className="text-[#c8c6c5] text-sm hover:text-[#25D366] hover:underline decoration-[#25D366] underline-offset-4 opacity-80 hover:opacity-100 transition-all"
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
              <p className="text-[#c8c6c5] text-sm opacity-50">Coming soon</p>
            )}
          </div>

          {/* Legal + CTA */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-4">
              Legal
            </h4>
            <ul className="flex flex-col gap-2 mb-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#c8c6c5] text-sm hover:text-[#e2e3e1] hover:underline decoration-[#ff571a] underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/book-trial"
              className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase px-6 py-3 hover:bg-white transition-all duration-300 active:scale-95"
            >
              BOOK A TRIAL
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#c8c6c5] opacity-50">
            © {new Date().getFullYear()} REVIVE FIGHT CLUB. ALL RIGHTS RESERVED.
          </p>
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="font-[family-name:var(--font-inter)] text-xs text-[#c8c6c5] opacity-50 hover:opacity-100 hover:text-[#e2e3e1] transition-all"
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
