'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TrialRequestStatus } from '@/types/database'
import { requireAdmin } from '@/lib/auth/getAdminSession'

export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string }

export async function updateTrialStatus(
  id: string,
  status: TrialRequestStatus,
  adminNotes?: string | null
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const updatePayload: {
      status: TrialRequestStatus
      updated_at: string
      admin_notes?: string | null
    } = {
      status,
      updated_at: new Date().toISOString(),
    }
    // Only include admin_notes when explicitly provided
    if (adminNotes !== undefined) {
      updatePayload.admin_notes = adminNotes ?? null
    }

    const { error } = await supabase
      .from('trial_requests')
      .update(updatePayload)
      .eq('id', id)

    if (error) {
      console.error('[updateTrialStatus]', error.message)
      return { success: false, error: 'Failed to update trial status.' }
    }

    revalidatePath('/admin/trials')
    revalidatePath(`/admin/trials/${id}`)
    return { success: true, message: 'Trial status updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateTrialNotes(
  id: string,
  adminNotes: string
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const { error } = await supabase
      .from('trial_requests')
      .update({ admin_notes: adminNotes, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('[updateTrialNotes]', error.message)
      return { success: false, error: 'Failed to save notes.' }
    }

    revalidatePath(`/admin/trials/${id}`)
    return { success: true, message: 'Notes saved.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}
