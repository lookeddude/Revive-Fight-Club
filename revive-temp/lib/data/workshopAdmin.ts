import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export interface AdminWorkshopListItem {
  id: string
  slug: string
  title: string
  status: string
  pricing_type: string
  price: number | null
  currency: string
  capacity: number | null
  is_featured: boolean
  featured_order: number
  start_datetime: string
  end_datetime: string
  created_at: string
  confirmedCount: number
  totalRegistrations: number
}

export interface AdminRegistration {
  id: string
  registration_id: string
  full_name: string
  email: string
  phone: string
  registration_status: string
  payment_status: string
  amount_paid: number | null
  custom_answers: Record<string, unknown>
  qr_token: string
  attendance_marked_at: string | null
  created_at: string
  workshop_id: string
}

export interface AdminWorkshopDetail {
  id: string
  slug: string
  title: string
  short_description: string | null
  description: string | null
  cover_image_path: string | null
  gallery_images: string[]
  location: string | null
  online_meeting_url: string | null
  workshop_mode: string
  start_datetime: string
  end_datetime: string
  registration_deadline: string | null
  pricing_type: string
  price: number | null
  currency: string
  capacity: number | null
  waitlist_enabled: boolean
  status: string
  is_featured: boolean
  featured_order: number
  what_you_learn: string[]
  requirements: string[]
  created_at: string
  updated_at: string
  instructors: Array<{ id: string; name: string; bio: string | null; photo_path: string | null; display_order: number }>
  faqs: Array<{ id: string; question: string; answer: string; display_order: number }>
  registrationFields: Array<{ id: string; field_key: string; label: string; field_type: string; required: boolean; placeholder: string | null; options: string[] | null; display_order: number }>
}

/**
 * List all workshops for admin (all statuses).
 */
export async function adminGetWorkshops(): Promise<AdminWorkshopListItem[]> {
  const supabase = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workshops } = await (supabase as any)
    .from('workshops')
    .select('id,slug,title,status,pricing_type,price,currency,capacity,is_featured,featured_order,start_datetime,end_datetime,created_at')
    .order('created_at', { ascending: false })

  if (!workshops) return []

  const workshopIds = workshops.map((w: AdminWorkshopListItem) => w.id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: regCounts } = await (supabase as any)
    .from('workshop_registrations')
    .select('workshop_id,registration_status')
    .in('workshop_id', workshopIds)

  const confirmedMap: Record<string, number> = {}
  const totalMap: Record<string, number> = {}
  if (regCounts) {
    for (const row of regCounts) {
      totalMap[row.workshop_id] = (totalMap[row.workshop_id] ?? 0) + 1
      if (['confirmed','attended'].includes(row.registration_status)) {
        confirmedMap[row.workshop_id] = (confirmedMap[row.workshop_id] ?? 0) + 1
      }
    }
  }

  return workshops.map((w: AdminWorkshopListItem) => ({
    ...w,
    confirmedCount: confirmedMap[w.id] ?? 0,
    totalRegistrations: totalMap[w.id] ?? 0,
  }))
}

/**
 * Get single workshop detail for admin editing.
 */
export async function adminGetWorkshopById(id: string): Promise<AdminWorkshopDetail | null> {
  const supabase = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workshop } = await (supabase as any)
    .from('workshops')
    .select('*')
    .eq('id', id)
    .single()

  if (!workshop) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ data: instructors }, { data: faqs }, { data: fields }] = await Promise.all([
    (supabase as any).from('workshop_instructors').select('*').eq('workshop_id', id).order('display_order'),
    (supabase as any).from('workshop_faqs').select('*').eq('workshop_id', id).order('display_order'),
    (supabase as any).from('workshop_registration_fields').select('*').eq('workshop_id', id).order('display_order'),
  ])

  return {
    ...workshop,
    instructors: instructors ?? [],
    faqs: faqs ?? [],
    registrationFields: fields ?? [],
  }
}

/**
 * Get registrations for a workshop with pagination.
 */
export async function adminGetRegistrations(workshopId: string, options: {
  page?: number
  pageSize?: number
  status?: string
  search?: string
} = {}): Promise<{ registrations: AdminRegistration[]; total: number }> {
  const supabase = createAdminClient()
  const page = options.page ?? 1
  const pageSize = options.pageSize ?? 50
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('workshop_registrations')
    .select('id,registration_id,full_name,email,phone,registration_status,payment_status,amount_paid,custom_answers,qr_token,attendance_marked_at,created_at,workshop_id', { count: 'exact' })
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (options.status && options.status !== 'all') {
    query = query.eq('registration_status', options.status)
  }

  if (options.search) {
    const s = options.search.trim()
    query = query.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,registration_id.ilike.%${s}%`)
  }

  const { data, count } = await query
  return { registrations: data ?? [], total: count ?? 0 }
}

/**
 * Get a single registration by ID (admin).
 */
export async function adminGetRegistrationById(regId: string): Promise<AdminRegistration | null> {
  const supabase = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('workshop_registrations')
    .select('*')
    .eq('id', regId)
    .single()

  return data ?? null
}

/**
 * Get registration by QR token (admin).
 */
export async function getRegistrationByQrToken(token: string) {
  const supabase = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('workshop_registrations')
    .select('*,workshops(id,title,start_datetime,end_datetime)')
    .eq('qr_token', token)
    .maybeSingle()

  return data ?? null
}

/**
 * Export registrations as CSV data.
 */
export async function exportRegistrationsAsCSV(workshopId: string): Promise<string> {
  const supabase = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workshop } = await (supabase as any)
    .from('workshops')
    .select('title')
    .eq('id', workshopId)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: regs } = await (supabase as any)
    .from('workshop_registrations')
    .select('registration_id,full_name,email,phone,registration_status,payment_status,amount_paid,attendance_marked_at,created_at')
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false })

  const workshopTitle = workshop?.title ?? 'Workshop'

  const headers = ['Registration ID','Full Name','Email','Phone','Registration Status','Payment Status','Amount (INR)','Attendance Marked At','Registered At','Workshop']
  const rows = (regs ?? []).map((r: AdminRegistration & { attendance_marked_at: string | null }) => [
    r.registration_id,
    `"${r.full_name.replace(/"/g, '""')}"`,
    r.email,
    r.phone,
    r.registration_status,
    r.payment_status,
    r.amount_paid ?? '',
    r.attendance_marked_at ?? '',
    r.created_at,
    `"${workshopTitle.replace(/"/g, '""')}"`,
  ])

  return [headers.join(','), ...rows.map((r: (string | number)[]) => r.join(','))].join('\n')
}
