import Link from 'next/link'

const footerLinks = {
  links: [
    { href: '/programs', label: 'Programs' },
    { href: '/trainers', label: 'Trainers' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/membership', label: 'Membership' },
    { href: '/about', label: 'About' },
  ],
  social: [
    { href: '#', label: 'Instagram' },
    { href: '#', label: 'Facebook' },
    { href: '#', label: 'YouTube' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0d0f0e] text-[#e2e3e1] border-t border-white/10 pt-24 pb-8">
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
            <p className="text-[#c8c6c5] text-sm leading-relaxed mb-2 opacity-80">
              Frazer Town, Bengaluru
            </p>
            <p className="text-[#c8c6c5] text-sm mb-2 opacity-80">+91 9876543210</p>
            <p className="text-[#c8c6c5] text-sm opacity-80">Mon–Sat: 06:00 – 22:00</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-4">
              Links
            </h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.links.map((link) => (
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

          {/* Social */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-4">
              Social
            </h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#c8c6c5] text-sm hover:text-[#e2e3e1] hover:underline decoration-[#ff571a] underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-4">
              Legal
            </h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
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
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#c8c6c5] opacity-50">
            © {new Date().getFullYear()} REVIVE FIGHT CLUB. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}
