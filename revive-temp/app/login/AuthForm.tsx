'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Mode = 'login' | 'signup' | 'forgot'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) setError(error.message)
    } catch {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const supabase = createClient()

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message === 'Invalid login credentials'
            ? 'Incorrect email or password. Please try again.'
            : error.message)
          return
        }
        router.push('/')
        router.refresh()

      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          setError('Please enter your full name.')
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.')
          return
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        })
        if (error) {
          setError(error.message)
          return
        }
        setSuccess('Account created! Check your email to confirm your account, then sign in.')
        setMode('login')

      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account/reset-password`,
        })
        if (error) {
          setError(error.message)
          return
        }
        setSuccess('Password reset link sent! Check your email.')
      }
    } finally {
      setLoading(false)
    }
  }

  const titles: Record<Mode, string> = {
    login: 'Welcome Back',
    signup: 'Create Account',
    forgot: 'Reset Password',
  }

  const subtitles: Record<Mode, string> = {
    login: 'Sign in to your Revive Fight Club account',
    signup: 'Join the Revive Fight Club community',
    forgot: "Enter your email and we'll send a reset link",
  }

  return (
    <div className="min-h-screen bg-[#0a0b0a] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-[#e2e3e1] tracking-tighter hover:opacity-80 transition-opacity"
          >
            REVIVE FIGHT CLUB
          </Link>
          <div className="mt-1 h-0.5 w-12 bg-[#ff571a] mx-auto" />
        </div>

        {/* Card */}
        <div className="bg-[#111312] border border-white/8 p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-[#e2e3e1] tracking-tight">
              {titles[mode]}
            </h1>
            <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-1">
              {subtitles[mode]}
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#22c55e]">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#ef4444]">{error}</p>
            </div>
          )}

          {/* Google Sign-In — only on login and signup */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-[#111] font-[family-name:var(--font-inter)] text-sm font-semibold py-3 hover:bg-[#f0ede8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-5"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {googleLoading ? 'Redirecting…' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="font-[family-name:var(--font-inter)] text-xs text-[#4b5563] uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full name — signup only */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="fullName"
                  className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#9ca3af]"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="w-full bg-[#1a1c1b] border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm px-4 py-3 focus:outline-none focus:border-[#ff571a] transition-colors placeholder:text-[#4b5563]"
                />
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#9ca3af]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-[#1a1c1b] border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm px-4 py-3 focus:outline-none focus:border-[#ff571a] transition-colors placeholder:text-[#4b5563]"
              />
            </div>

            {/* Password — not shown in forgot mode */}
            {mode !== 'forgot' && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#9ca3af]"
                  >
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); setSuccess(null) }}
                      className="font-[family-name:var(--font-inter)] text-xs text-[#6b7280] hover:text-[#ff571a] transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="w-full bg-[#1a1c1b] border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm px-4 py-3 pr-12 focus:outline-none focus:border-[#ff571a] transition-colors placeholder:text-[#4b5563]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#9ca3af] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase py-4 hover:bg-white transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'login' ? 'Signing In...' : mode === 'signup' ? 'Creating Account...' : 'Sending Link...'}
                </span>
              ) : (
                mode === 'login' ? 'SIGN IN' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SEND RESET LINK'
              )}
            </button>
          </form>

          {/* Mode switcher */}
          <div className="mt-6 pt-6 border-t border-white/8 text-center">
            {mode === 'login' && (
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280]">
                New to Revive?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(null); setSuccess(null) }}
                  className="text-[#ff571a] hover:text-[#ffb59e] font-bold transition-colors"
                >
                  Create an account
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280]">
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
                  className="text-[#ff571a] hover:text-[#ffb59e] font-bold transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => { setMode('login'); setError(null); setSuccess(null) }}
                className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] hover:text-[#ff571a] transition-colors flex items-center gap-1 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6 font-[family-name:var(--font-inter)] text-xs text-[#4b5563]">
          <Link href="/" className="hover:text-[#6b7280] transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
