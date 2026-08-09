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

  // Use server-side COUNT queries — much more efficient than fetching all rows
  const [
    trialTotal, trialPending, trialContacted, trialConfirmed,
    trialCompleted, trialCancelled, trialNoShow,
    trialToday, trialWeek, trialMonth,
    enquiryTotal, enquiryNew, enquiryContacted, enquiryResolved, enquirySpam,
    enquiryToday, enquiryWeek,
    progCount, trainerCount, scheduleCount, membershipCount, reviewCount, faqCount,
  ] = await Promise.all([
    // Trial counts by status
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }),
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).eq('status', 'no_show'),
    // Trial counts by date
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
    supabase.from('trial_requests').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
    // Enquiry counts by status
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }),
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'spam'),
    // Enquiry counts by date
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
    // Content counts
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('trainers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('schedule_items').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('membership_plans').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('faqs').select('*', { count: 'exact', head: true }).eq('is_published', true),
  ])

  return {
    trials: {
      total:      trialTotal.count     ?? 0,
      pending:    trialPending.count   ?? 0,
      contacted:  trialContacted.count ?? 0,
      confirmed:  trialConfirmed.count ?? 0,
      completed:  trialCompleted.count ?? 0,
      cancelled:  trialCancelled.count ?? 0,
      no_show:    trialNoShow.count    ?? 0,
      today:      trialToday.count     ?? 0,
      this_week:  trialWeek.count      ?? 0,
      this_month: trialMonth.count     ?? 0,
    },
    enquiries: {
      total:     enquiryTotal.count     ?? 0,
      new:       enquiryNew.count       ?? 0,
      contacted: enquiryContacted.count ?? 0,
      resolved:  enquiryResolved.count  ?? 0,
      spam:      enquirySpam.count      ?? 0,
      today:     enquiryToday.count     ?? 0,
      this_week: enquiryWeek.count      ?? 0,
    },
    content: {
      active_programs:        progCount.count     ?? 0,
      active_trainers:        trainerCount.count  ?? 0,
      active_schedule_items:  scheduleCount.count ?? 0,
      active_membership_plans: membershipCount.count ?? 0,
      published_reviews:      reviewCount.count   ?? 0,
      published_faqs:         faqCount.count      ?? 0,
    },
  }
}
