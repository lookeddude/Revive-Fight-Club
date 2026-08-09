import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accept Invitation | Revive Fight Club',
  robots: { index: false, follow: false },
}

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params
  const adminClient = createAdminClient()

  // Look up the invitation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: invite, error } = await (adminClient as any)
    .from('staff_invitations')
    .select('id, email, role, status, expires_at')
    .eq('token', token)
    .maybeSingle()

  // Invalid token
  if (error || !invite) {
    return <ErrorPage title="Invalid Link" message="This invitation link is invalid or has already been used." />
  }

  // Expired
  if (invite.status === 'expired' || new Date(invite.expires_at) < new Date()) {
    return <ErrorPage title="Link Expired" message="This invitation link has expired. Please ask the admin to send a new one." />
  }

  // Already accepted
  if (invite.status === 'accepted') {
    return <ErrorPage title="Already Accepted" message="This invitation has already been accepted. Please log in to the admin panel." cta={{ href: '/admin/login', label: 'Go to Login' }} />
  }

  // Check if the current user is signed in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is signed in with the correct email → apply role and redirect
  if (user && user.email?.toLowerCase() === invite.email.toLowerCase()) {
    // Apply role
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from('profiles').upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name ?? invite.email.split('@')[0],
      role: invite.role,
      is_active: true,
    })
    // Mark accepted
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any)
      .from('staff_invitations')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', invite.id)

    redirect('/admin')
  }

  // If signed in but wrong email
  if (user && user.email?.toLowerCase() !== invite.email.toLowerCase()) {
    return (
      <PageShell>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-amber-400 font-[family-name:var(--font-inter)]">Wrong Account</p>
            <h1 className="text-2xl font-bold text-[#e2e3e1] font-[family-name:var(--font-outfit)] uppercase">Different Email</h1>
          </div>
        </div>
        <p className="text-[#bab8b7] font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-6">
          You are currently signed in as <strong className="text-[#e2e3e1]">{user.email}</strong>, but this invitation was sent to <strong className="text-[#ff571a]">{invite.email}</strong>.
        </p>
        <p className="text-[#bab8b7] font-[family-name:var(--font-inter)] text-sm mb-8">
          Please sign out and sign in with the correct account to accept this invitation.
        </p>
        <Link
          href="/admin/login"
          className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-3 hover:bg-white transition-colors"
        >
          SIGN IN WITH CORRECT ACCOUNT
        </Link>
      </PageShell>
    )
  }

  // Not signed in → show invitation details and link to sign up
  const roleLabels: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    receptionist: 'Receptionist',
  }

  return (
    <PageShell>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-[#ff571a] flex items-center justify-center">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth={2} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#ff571a] font-[family-name:var(--font-inter)]">You&apos;ve been invited</p>
          <h1 className="text-2xl font-bold text-[#e2e3e1] font-[family-name:var(--font-outfit)] uppercase">Join Revive FC</h1>
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.03] p-5 mb-8">
        <dl className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <dt className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Email</dt>
            <dd className="text-sm text-[#e2e3e1] font-[family-name:var(--font-inter)]">{invite.email}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Role</dt>
            <dd>
              <span className="text-xs font-bold tracking-[0.1em] uppercase px-2 py-1 bg-[#ff571a]/20 text-[#ff571a] font-[family-name:var(--font-inter)]">
                {roleLabels[invite.role] ?? invite.role}
              </span>
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-xs font-bold tracking-[0.1em] uppercase text-[#6b7280] font-[family-name:var(--font-inter)]">Expires</dt>
            <dd className="text-sm text-[#bab8b7] font-[family-name:var(--font-inter)]">
              {new Date(invite.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </dd>
          </div>
        </dl>
      </div>

      <p className="text-sm text-[#bab8b7] font-[family-name:var(--font-inter)] mb-6 leading-relaxed">
        Sign in or create an account using the email address above to accept this invitation and access the Revive Fight Club admin panel.
      </p>

      <Link
        href={`/admin/login?invite=${token}&email=${encodeURIComponent(invite.email)}`}
        className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-3 hover:bg-white transition-colors"
      >
        SIGN IN TO ACCEPT
      </Link>
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0b0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-white/10 bg-[#111312] p-8">
        <div className="mb-8">
          <span className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-lg uppercase tracking-tight">
            REVIVE FIGHT CLUB
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

function ErrorPage({ title, message, cta }: { title: string; message: string; cta?: { href: string; label: string } }) {
  return (
    <PageShell>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-red-500/20 border border-red-500/40 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth={2} d="M12 9v4m0 4h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#e2e3e1] font-[family-name:var(--font-outfit)] uppercase">{title}</h1>
      </div>
      <p className="text-[#bab8b7] font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-8">{message}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-block bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-3 hover:bg-white transition-colors"
        >
          {cta.label}
        </Link>
      )}
    </PageShell>
  )
}
