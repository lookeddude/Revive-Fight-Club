/**
 * Navbar — server component wrapper around Header.
 * Fetches logo_url from business_settings on the server so the logo
 * is baked into the initial HTML (no flash, no client-side fetch).
 */
import { createClient } from '@/lib/supabase/server'
import { Header } from './Header'

export async function Navbar() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('business_settings')
    .select('logo_url')
    .eq('id', 1)
    .maybeSingle()

  return <Header logoUrl={data?.logo_url ?? null} />
}
