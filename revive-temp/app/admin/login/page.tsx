import type { Metadata } from 'next'
import Link from 'next/link'
import { AdminLoginForm } from './AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login | Revive Fight Club',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-[#ff571a] flex items-center justify-center flex-shrink-0">
            <span className="text-black font-[family-name:var(--font-outfit)] font-bold text-sm">RFC</span>
          </div>
          <div>
            <p className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-base uppercase tracking-tight leading-none">
              Revive Fight Club
            </p>
            <p className="font-[family-name:var(--font-inter)] text-[11px] text-[#6b7280] tracking-wider uppercase mt-0.5">
              Staff Portal
            </p>
          </div>
        </div>

        <h1 className="font-[family-name:var(--font-inter)] font-semibold text-[#e2e3e1] text-xl mb-1">
          Sign in
        </h1>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mb-8">
          Access the management dashboard.
        </p>

        <AdminLoginForm />

        <p className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563] mt-8 text-center">
          Not a staff member?{' '}
          <Link href="/" className="text-[#6b7280] hover:text-[#9ca3af] transition-colors">
            Return to website
          </Link>
        </p>
      </div>
    </div>
  )
}
