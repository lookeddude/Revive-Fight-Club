'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/actions/admin/authActions'

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await adminLogin(email.trim(), password)
      if (result.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(result.error)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20">
          <p className="font-[family-name:var(--font-inter)] text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="admin-email"
          className="font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider"
        >
          Email address
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@revivefightclub.com"
          className="bg-[#111312] border border-white/10 px-3 py-2.5 text-sm text-[#e2e3e1] placeholder:text-[#4b5563] focus:outline-none focus:border-[#ff571a] transition-colors w-full"
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="admin-password"
          className="font-[family-name:var(--font-inter)] text-xs font-medium text-[#9ca3af] uppercase tracking-wider"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className="bg-[#111312] border border-white/10 px-3 py-2.5 text-sm text-[#e2e3e1] placeholder:text-[#4b5563] focus:outline-none focus:border-[#ff571a] transition-colors w-full"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.08em] uppercase py-3 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
