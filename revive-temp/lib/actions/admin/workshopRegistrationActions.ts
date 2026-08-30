'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/getAdminSession'

export async function markAttendance(
  registrationUuid: string,
  workshopId: string,
  adminUserId: string,
  status: 'attended' | 'no_show'
) {
  await requireAdmin()
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reg } = await (supabase as any)
    .from('workshop_registrations')
    .select('id,registration_status')
    .eq('id', registrationUuid)
    .single()

  if (!reg) return { success: false, error: 'Registration not found' }
  if (reg.registration_status === 'attended' && status === 'attended') {
    return { success: false, error: 'ALREADY_ATTENDED' }
  }
  if (!['confirmed','pending'].includes(reg.registration_status) && status === 'attended') {
    return { success: false, error: 'Registration is not in a valid state for attendance' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('workshop_registrations')
    .update({
      registration_status: status,
      attendance_marked_at: new Date().toISOString(),
      attended_by: adminUserId,
    })
    .eq('id', registrationUuid)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/admin/workshops/${workshopId}/attendance`)
  revalidatePath(`/admin/workshops/${workshopId}/registrations`)
  return { success: true }
}

export async function updateRegistrationStatus(
  registrationUuid: string,
  workshopId: string,
  status: 'confirmed' | 'cancelled' | 'waitlisted'
) {
  await requireAdmin()
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('workshop_registrations')
    .update({ registration_status: status })
    .eq('id', registrationUuid)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/admin/workshops/${workshopId}/registrations`)
  return { success: true }
}
