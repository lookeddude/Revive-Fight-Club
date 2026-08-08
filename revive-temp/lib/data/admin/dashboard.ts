import { createClient } from '@/lib/supabase/server'

export type DashboardMetrics = {
  trials: {
    total: number
    pending: number
    contacted: number
    confirmed: number
    completed: number
    cancelled: number
    no_show: number
    today: number
    this_week: number
    this_month: number
  }
  enquiries: {
    total: number
    new: number
    contacted: number
    resolved: number
    spam: number
    today: number
    this_week: number
  }
  content: {
    active_programs: number
    active_trainers: number
    active_schedule_items: number
    active_membership_plans: number
    published_reviews: number
    published_faqs: number
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [trialsRes, enquiriesRes, programsRes, trainersRes, scheduleRes, membershipsRes, reviewsRes, faqsRes] =
    await Promise.all([
      supabase.from('trial_requests').select('status, created_at'),
      supabase.from('contact_enquiries').select('status, created_at'),
      supabase.from('programs').select('id').eq('is_active', true),
      supabase.from('trainers').select('id').eq('is_active', true),
      supabase.from('schedule_items').select('id').eq('is_active', true),
      supabase.from('membership_plans').select('id').eq('is_active', true),
      supabase.from('reviews').select('id').eq('is_published', true),
      supabase.from('faqs').select('id').eq('is_published', true),
    ])

  const trials = trialsRes.data ?? []
  const enquiries = enquiriesRes.data ?? []

  return {
    trials: {
      total: trials.length,
      pending: trials.filter(t => t.status === 'pending').length,
      contacted: trials.filter(t => t.status === 'contacted').length,
      confirmed: trials.filter(t => t.status === 'confirmed').length,
      completed: trials.filter(t => t.status === 'completed').length,
      cancelled: trials.filter(t => t.status === 'cancelled').length,
      no_show: trials.filter(t => t.status === 'no_show').length,
      today: trials.filter(t => t.created_at >= todayStart).length,
      this_week: trials.filter(t => t.created_at >= weekStart).length,
      this_month: trials.filter(t => t.created_at >= monthStart).length,
    },
    enquiries: {
      total: enquiries.length,
      new: enquiries.filter(e => e.status === 'new').length,
      contacted: enquiries.filter(e => e.status === 'contacted').length,
      resolved: enquiries.filter(e => e.status === 'resolved').length,
      spam: enquiries.filter(e => e.status === 'spam').length,
      today: enquiries.filter(e => e.created_at >= todayStart).length,
      this_week: enquiries.filter(e => e.created_at >= weekStart).length,
    },
    content: {
      active_programs: programsRes.data?.length ?? 0,
      active_trainers: trainersRes.data?.length ?? 0,
      active_schedule_items: scheduleRes.data?.length ?? 0,
      active_membership_plans: membershipsRes.data?.length ?? 0,
      published_reviews: reviewsRes.data?.length ?? 0,
      published_faqs: faqsRes.data?.length ?? 0,
    },
  }
}
