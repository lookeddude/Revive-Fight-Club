import { createClient } from '@/lib/supabase/server'
import type { TrialRequest } from '@/types/database'

export type TrialWithProgram = TrialRequest & {
  programs: { name: string } | null
}

export type TrialListParams = {
  status?: string
  search?: string
  page?: number
  pageSize?: number
}

export async function getTrials(
  params: TrialListParams = {}
): Promise<{ data: TrialWithProgram[]; count: number }> {
  const supabase = await createClient()
  const { status, search, page = 1, pageSize = 20 } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('trial_requests')
    .select('*, programs(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status && status !== 'all') {
    query = query.eq('status', status as import('@/types/database').TrialRequestStatus)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, count, error } = await query
  if (error) {
    console.error('[getTrials]', error.message)
    return { data: [], count: 0 }
  }

  return {
    data: (data ?? []) as unknown as TrialWithProgram[],
    count: count ?? 0,
  }
}

export async function getTrialById(id: string): Promise<TrialWithProgram | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('trial_requests')
    .select('*, programs(name)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[getTrialById]', error.message)
    return null
  }
  return data as unknown as TrialWithProgram
}
