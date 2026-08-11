'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdminRole } from '@/lib/auth/getAdminSession'

export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string }

type SettingsInput = {
  business_name?: string
  tagline?: string | null
  phone?: string | null
  whatsapp_number?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  google_maps_url?: string | null
  instagram_url?: string | null
  facebook_url?: string | null
  youtube_url?: string | null
  opening_hours?: Record<string, string> | null
  logo_url?: string | null
}

export async function updateBusinessSettings(
  input: SettingsInput
): Promise<ActionResult> {
  try {
    // Admin-only
    await requireAdminRole()

    const supabase = await createClient()

    const { error } = await supabase
      .from('business_settings')
      .upsert({ id: 1, ...input, updated_at: new Date().toISOString() })
      .eq('id', 1)

    if (error) {
      console.error('[updateBusinessSettings]', error.message)
      return { success: false, error: 'Failed to update business settings.' }
    }

    // Revalidate all pages that use business_settings
    revalidatePath('/')
    revalidatePath('/contact')
    revalidatePath('/about')
    revalidatePath('/book-trial')
    revalidatePath('/membership')
    revalidatePath('/programs')
    revalidatePath('/trainers')
    revalidatePath('/schedule')
    revalidatePath('/admin/settings')

    return { success: true, message: 'Business settings updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}
