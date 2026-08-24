import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Supabase OAuth Callback Handler
 * After Google sign-in, Supabase redirects here with a code.
 * We exchange it for a session and redirect the user.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/'
  // Prevent open redirect: only allow relative paths starting with /
  // Block protocol-relative URLs like //evil.com
  const next = (rawNext.startsWith('/') && !rawNext.startsWith('//')) ? rawNext : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to intended page (or home)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
