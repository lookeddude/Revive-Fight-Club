'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { generateSlug } from '@/lib/workshops'

export interface WorkshopFormData {
  title: string
  slug: string
  short_description: string
  description: string
  cover_image_path: string
  gallery_images: string[]
  location: string
  online_meeting_url: string
  workshop_mode: 'in_person' | 'online' | 'hybrid'
  start_datetime: string
  end_datetime: string
  registration_deadline: string
  pricing_type: 'free' | 'paid'
  price: number | null
  currency: string
  capacity: number | null
  waitlist_enabled: boolean
  status: string
  is_featured: boolean
  featured_order: number
  what_you_learn: string[]
  requirements: string[]
  instructors: Array<{ name: string; bio: string; photo_path: string; display_order: number }>
  faqs: Array<{ question: string; answer: string; display_order: number }>
  registrationFields: Array<{
    field_key: string
    label: string
    field_type: string
    required: boolean
    placeholder: string
    options: string[]
    display_order: number
  }>
}

export async function createWorkshop(formData: WorkshopFormData) {
  await requireAdmin()
  const supabase = createAdminClient()

  const slug = formData.slug?.trim() || generateSlug(formData.title)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workshop, error } = await (supabase as any)
    .from('workshops')
    .insert({
      slug,
      title: formData.title.trim(),
      short_description: formData.short_description?.trim() || null,
      description: formData.description?.trim() || null,
      cover_image_path: formData.cover_image_path || null,
      gallery_images: formData.gallery_images ?? [],
      location: formData.location?.trim() || null,
      online_meeting_url: formData.online_meeting_url?.trim() || null,
      workshop_mode: formData.workshop_mode,
      start_datetime: formData.start_datetime,
      end_datetime: formData.end_datetime,
      registration_deadline: formData.registration_deadline || null,
      pricing_type: formData.pricing_type,
      price: formData.pricing_type === 'paid' ? formData.price : null,
      currency: formData.currency || 'INR',
      capacity: formData.capacity || null,
      waitlist_enabled: formData.waitlist_enabled,
      status: formData.status || 'draft',
      is_featured: formData.is_featured,
      featured_order: formData.featured_order,
      what_you_learn: formData.what_you_learn ?? [],
      requirements: formData.requirements ?? [],
      published_at: formData.status === 'published' ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  if (error || !workshop) {
    return { success: false, error: error?.message ?? 'Failed to create workshop' }
  }

  await saveWorkshopRelations(supabase, workshop.id, formData)

  revalidatePath('/workshops')
  revalidatePath('/admin/workshops')
  revalidatePath('/')

  return { success: true, workshopId: workshop.id, slug }
}

export async function updateWorkshop(workshopId: string, formData: WorkshopFormData) {
  await requireAdmin()
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('workshops')
    .select('status,published_at')
    .eq('id', workshopId)
    .single()

  const publishedAt = existing?.status !== 'published' && formData.status === 'published'
    ? new Date().toISOString()
    : (existing?.published_at ?? null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('workshops')
    .update({
      slug: formData.slug?.trim() || generateSlug(formData.title),
      title: formData.title.trim(),
      short_description: formData.short_description?.trim() || null,
      description: formData.description?.trim() || null,
      cover_image_path: formData.cover_image_path || null,
      gallery_images: formData.gallery_images ?? [],
      location: formData.location?.trim() || null,
      online_meeting_url: formData.online_meeting_url?.trim() || null,
      workshop_mode: formData.workshop_mode,
      start_datetime: formData.start_datetime,
      end_datetime: formData.end_datetime,
      registration_deadline: formData.registration_deadline || null,
      pricing_type: formData.pricing_type,
      price: formData.pricing_type === 'paid' ? formData.price : null,
      currency: formData.currency || 'INR',
      capacity: formData.capacity || null,
      waitlist_enabled: formData.waitlist_enabled,
      status: formData.status,
      is_featured: formData.is_featured,
      featured_order: formData.featured_order,
      what_you_learn: formData.what_you_learn ?? [],
      requirements: formData.requirements ?? [],
      published_at: publishedAt,
    })
    .eq('id', workshopId)

  if (error) return { success: false, error: error.message }

  await saveWorkshopRelations(supabase, workshopId, formData)

  revalidatePath('/workshops')
  revalidatePath(`/workshops/${formData.slug}`)
  revalidatePath('/admin/workshops')
  revalidatePath(`/admin/workshops/${workshopId}`)
  revalidatePath('/')

  return { success: true }
}

export async function updateWorkshopStatus(workshopId: string, status: string) {
  await requireAdmin()
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, unknown> = { status }
  if (status === 'published') {
    updates.published_at = new Date().toISOString()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('workshops')
    .update(updates)
    .eq('id', workshopId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/workshops')
  revalidatePath('/admin/workshops')
  revalidatePath('/')

  return { success: true }
}

export async function duplicateWorkshop(workshopId: string) {
  await requireAdmin()
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: source } = await (supabase as any)
    .from('workshops')
    .select('*')
    .eq('id', workshopId)
    .single()

  if (!source) return { success: false, error: 'Workshop not found' }

  const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: newWorkshop, error } = await (supabase as any)
    .from('workshops')
    .insert({
      ...source,
      id: undefined,
      slug: newSlug,
      title: `${source.title} (Copy)`,
      status: 'draft',
      is_featured: false,
      published_at: null,
      created_at: undefined,
      updated_at: undefined,
    })
    .select('id,slug')
    .single()

  if (error || !newWorkshop) return { success: false, error: error?.message }

  // Copy relations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ data: instructors }, { data: faqs }, { data: fields }] = await Promise.all([
    (supabase as any).from('workshop_instructors').select('*').eq('workshop_id', workshopId),
    (supabase as any).from('workshop_faqs').select('*').eq('workshop_id', workshopId),
    (supabase as any).from('workshop_registration_fields').select('*').eq('workshop_id', workshopId),
  ])

  await Promise.all([
    instructors?.length ? (supabase as any).from('workshop_instructors').insert(instructors.map((i: Record<string, unknown>) => ({ ...i, id: undefined, workshop_id: newWorkshop.id }))) : Promise.resolve(),
    faqs?.length ? (supabase as any).from('workshop_faqs').insert(faqs.map((f: Record<string, unknown>) => ({ ...f, id: undefined, workshop_id: newWorkshop.id }))) : Promise.resolve(),
    fields?.length ? (supabase as any).from('workshop_registration_fields').insert(fields.map((f: Record<string, unknown>) => ({ ...f, id: undefined, workshop_id: newWorkshop.id }))) : Promise.resolve(),
  ])

  revalidatePath('/admin/workshops')
  return { success: true, workshopId: newWorkshop.id, slug: newWorkshop.slug }
}

async function saveWorkshopRelations(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  workshopId: string,
  formData: WorkshopFormData
) {
  // Replace instructors
  await supabase.from('workshop_instructors').delete().eq('workshop_id', workshopId)
  if (formData.instructors?.length) {
    await supabase.from('workshop_instructors').insert(
      formData.instructors.map((inst, i) => ({
        workshop_id: workshopId,
        name: inst.name.trim(),
        bio: inst.bio?.trim() || null,
        photo_path: inst.photo_path || null,
        display_order: inst.display_order ?? i,
      }))
    )
  }

  // Replace FAQs
  await supabase.from('workshop_faqs').delete().eq('workshop_id', workshopId)
  if (formData.faqs?.length) {
    await supabase.from('workshop_faqs').insert(
      formData.faqs.map((faq, i) => ({
        workshop_id: workshopId,
        question: faq.question.trim(),
        answer: faq.answer.trim(),
        display_order: faq.display_order ?? i,
      }))
    )
  }

  // Replace registration fields
  await supabase.from('workshop_registration_fields').delete().eq('workshop_id', workshopId)
  if (formData.registrationFields?.length) {
    await supabase.from('workshop_registration_fields').insert(
      formData.registrationFields.map((field, i) => ({
        workshop_id: workshopId,
        field_key: field.field_key,
        label: field.label.trim(),
        field_type: field.field_type,
        required: field.required,
        placeholder: field.placeholder?.trim() || null,
        options: field.options?.length ? field.options : null,
        display_order: field.display_order ?? i,
      }))
    )
  }
}
