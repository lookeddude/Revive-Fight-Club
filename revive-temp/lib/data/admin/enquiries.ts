import { createClient } from '@/lib/supabase/server'
import type { ContactEnquiry } from '@/types/database'

export type EnquiryListParams = {
  status?: string
  search?: string
  page?: number
  pageSize?: number
}

export async function getEnquiries(
  params: EnquiryListParams = {}
): Promise<{ data: ContactEnquiry[]; count: number }> {
  const supabase = await createClient()
  const { status, search, page = 1, pageSize = 20 } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('contact_enquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status && status !== 'all') {
    query = query.eq('status', status as import('@/types/database').ContactEnquiryStatus)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`)
  }

  const { data, count, error } = await query
  if (error) {
    console.error('[getEnquiries]', error.message)
    return { data: [], count: 0 }
  }

  return { data: data ?? [], count: count ?? 0 }
}

export async function getEnquiryById(id: string): Promise<ContactEnquiry | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contact_enquiries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[getEnquiryById]', error.message)
    return null
  }
  return data
}
