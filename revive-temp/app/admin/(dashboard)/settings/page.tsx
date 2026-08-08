import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './SettingsForm'

export const metadata: Metadata = { title: 'Business Settings' }

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('business_settings').select('*').eq('id', 1).single()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-xl uppercase tracking-tight">Business Settings</h2>
        <p className="font-[family-name:var(--font-inter)] text-sm text-[#6b7280] mt-1">Changes here update the public website in real-time.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
