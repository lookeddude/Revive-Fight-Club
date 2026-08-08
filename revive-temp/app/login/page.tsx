import type { Metadata } from 'next'
import { AuthForm } from './AuthForm'

export const metadata: Metadata = {
  title: 'Sign In | Revive Fight Club',
  description: 'Sign in or create your Revive Fight Club account.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <AuthForm />
}
