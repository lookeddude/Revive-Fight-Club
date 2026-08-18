import type { Metadata } from 'next'
import Link from 'next/link'
import { AdminLoginForm } from './AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login | Revive Fight Club',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #090a09 0%, #0d0f0e 50%, #0a0c0b 100%)',
      }}
    >
      {/* Left decorative panel — hidden on mobile */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #111412 0%, #0a0c0a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Large RFC watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="font-[family-name:var(--font-outfit)] font-black"
            style={{
              fontSize: '220px',
              lineHeight: 1,
              letterSpacing: '-0.06em',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,87,26,0.07)',
            }}
          >
            RFC
          </span>
        </div>

        {/* Orange glow bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom, rgba(255,87,26,0.1) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Brand */}
        <div className="relative z-10">
          <div
            className="w-10 h-10 flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #ff571a, #d94418)' }}
          >
            <span className="font-[family-name:var(--font-outfit)] font-black text-black text-sm">RFC</span>
          </div>
          <h2
            className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase tracking-[-0.03em] leading-tight mb-3"
            style={{ fontSize: '28px' }}
          >
            Revive Fight Club
          </h2>
          <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Bengaluru&apos;s elite combat sports and performance training facility.
          </p>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <div className="w-8 h-px mb-4" style={{ background: '#ff571a' }} aria-hidden="true" />
          <p className="font-[family-name:var(--font-outfit)] font-bold text-lg uppercase leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Train like a fighter.<br />
            <span style={{ color: '#ff571a' }}>Perform</span> like a champion.
          </p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[360px]">
          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-9 h-9 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ff571a, #d94418)' }}
            >
              <span className="font-[family-name:var(--font-outfit)] font-black text-black text-sm">RFC</span>
            </div>
            <div>
              <p className="font-[family-name:var(--font-outfit)] font-black text-[#e8e4df] text-sm uppercase tracking-tight leading-none">
                Revive Fight Club
              </p>
              <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: 'rgba(255,87,26,0.7)' }}>
                Staff Portal
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p
              className="font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: 'rgba(255,87,26,0.8)' }}
            >
              Staff Portal
            </p>
            <h1
              className="font-[family-name:var(--font-outfit)] font-black text-[#f0ede8] uppercase tracking-[-0.03em] leading-none"
              style={{ fontSize: '36px' }}
            >
              Sign In
            </h1>
            <p
              className="font-[family-name:var(--font-body)] text-sm mt-3"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Access the Revive Fight Club management dashboard.
            </p>
          </div>

          {/* The actual login form (server-side component unchanged) */}
          <AdminLoginForm />

          {/* Footer */}
          <p
            className="font-[family-name:var(--font-body)] text-sm mt-8 text-center"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            Not staff?{' '}
            <Link
              href="/"
              className="transition-colors hover:text-[#e2e3e1]"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Return to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
