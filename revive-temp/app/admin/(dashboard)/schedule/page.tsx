import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ScheduleManager } from './ScheduleManager'

export const metadata: Metadata = { title: 'Schedule' }

export default async function AdminSchedulePage() {
  const supabase = await createClient()
  const [{ data: items }, { data: programs }, { data: trainers }] = await Promise.all([
    supabase.from('schedule_items').select('*, programs(name), trainers(name)').order('day_of_week').order('start_time'),
    supabase.from('programs').select('id, name').eq('is_active', true).order('sort_order'),
    supabase.from('trainers').select('id, name').eq('is_active', true).order('sort_order'),
  ])

  return (
    <div className="max-w-6xl space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Schedule</h2>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-0.5">{items?.length ?? 0} class sessions</p>
      </div>
      <ScheduleManager
        items={items ?? []}
        programs={programs ?? []}
        trainers={trainers ?? []}
      />
    </div>
  )
}
