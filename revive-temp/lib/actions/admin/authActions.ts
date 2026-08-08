'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type LoginResult =
  | { success: true }
  | { success: false; error: string }

export async function adminLogin(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return { success: false, error: 'Invalid email or password.' }
    }

    // Verify profile exists + is active
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Your account does not have admin access. Contact the system administrator.',
      }
    }

    if (!profile.is_active) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Your account has been deactivated. Contact the system administrator.',
      }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function adminLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
