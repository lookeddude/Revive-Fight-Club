import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Supabase Admin Client — SERVER ONLY
 *
 * Uses the service-role key. NEVER import this in client components.
 * This client BYPASSES Row Level Security.
 *
 * Use only when RLS-based reads are insufficient (e.g. auth.admin operations).
 * For most admin operations, prefer the regular server client + RLS.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
      'Ensure these are set in .env.local and never exposed to the browser.'
    )
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
