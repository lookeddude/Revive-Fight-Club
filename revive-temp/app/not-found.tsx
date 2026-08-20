import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found | Revive Fight Club',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
}

/**
 * not-found.tsx — Custom 404 page
 * Next.js automatically returns HTTP 404 status for this page.
 * Not indexed. Provides navigation back to the site.
 */
export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#0d0c0b' }}
    >
      {/* Brand accent */}
      <div
        className="w-16 h-1 mb-8"
        style={{ background: '#ff571a' }}
        aria-hidden="true"
      />

      {/* 404 */}
      <p
        className="font-[family-name:var(--font-outfit)] font-black text-8xl md:text-[140px] leading-none tracking-tighter select-none"
        style={{ color: 'rgba(255,87,26,0.12)' }}
        aria-hidden="true"
      >
        404
      </p>

      {/* Heading */}
      <h1
        className="font-[family-name:var(--font-outfit)] font-black text-3xl md:text-5xl uppercase tracking-tight text-[#f0ede8] -mt-4 mb-4"
      >
        Page Not Found
      </h1>

      <p className="font-[family-name:var(--font-body)] text-[#8a8480] text-base md:text-lg max-w-md mb-10">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      {/* Primary CTA */}
      <Link
        href="/"
        className="inline-block font-[family-name:var(--font-body)] font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 text-black transition-colors duration-150 mb-10"
        style={{ background: '#ff571a' }}
      >
        Back to Home
      </Link>

      {/* Quick nav */}
      <nav aria-label="Helpful links">
        <p className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[#4a4540] mb-4">
          Or explore
        </p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {[
            { href: '/programs', label: 'Programs' },
            { href: '/trainers', label: 'Trainers' },
            { href: '/membership', label: 'Membership' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-[family-name:var(--font-body)] text-sm font-medium transition-colors duration-150 hover:text-[#ff571a]"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom brand */}
      <p
        className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] mt-16"
        style={{ color: 'rgba(255,255,255,0.1)' }}
      >
        Revive Fight Club · Bengaluru
      </p>
    </div>
  )
}
