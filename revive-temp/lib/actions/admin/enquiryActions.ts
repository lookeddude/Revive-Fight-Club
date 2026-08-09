'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ContactEnquiryStatus } from '@/types/database'
import { requireAdmin } from '@/lib/auth/getAdminSession'

export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string }

export async function updateEnquiryStatus(
  id: string,
  status: ContactEnquiryStatus,
  adminNotes?: string | null
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const updatePayload: {
      status: ContactEnquiryStatus
      updated_at: string
      admin_notes?: string | null
    } = {
      status,
      updated_at: new Date().toISOString(),
    }
    if (adminNotes !== undefined) {
      updatePayload.admin_notes = adminNotes ?? null
    }

    const { error } = await supabase
      .from('contact_enquiries')
      .update(updatePayload)
      .eq('id', id)

    if (error) {
      console.error('[updateEnquiryStatus]', error.message)
      return { success: false, error: 'Failed to update enquiry status.' }
    }

    revalidatePath('/admin/enquiries')
    revalidatePath(`/admin/enquiries/${id}`)
    return { success: true, message: 'Enquiry status updated.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function updateEnquiryNotes(
  id: string,
  adminNotes: string
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const { error } = await supabase
      .from('contact_enquiries')
      .update({ admin_notes: adminNotes, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('[updateEnquiryNotes]', error.message)
      return { success: false, error: 'Failed to save notes.' }
    }

    revalidatePath(`/admin/enquiries/${id}`)
    return { success: true, message: 'Notes saved.' }
  } catch {
    return { success: false, error: 'Something went wrong.' }
  }
}
