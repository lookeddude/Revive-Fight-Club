import { createClient } from '@/lib/supabase/server'

export type HeroSlide = {
  id: string
  desktop_url: string
  mobile_url: string | null
  tablet_url: string | null
  alt_text: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type HeroSettings = {
  id: number
  interval_seconds: number
  transition: string
  updated_at: string
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[getHeroSlides]', error.message)
    return []
  }
  return (data ?? []) as HeroSlide[]
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  const slides = await getHeroSlides()
  return slides.filter(s => s.is_active)
}

export async function getHeroSettings(): Promise<HeroSettings> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hero_settings')
    .select('*')
    .eq('id', 1)
    .single()

  return (data as HeroSettings) ?? {
    id: 1,
    interval_seconds: 5,
    transition: 'fade',
    updated_at: new Date().toISOString(),
  }
}
