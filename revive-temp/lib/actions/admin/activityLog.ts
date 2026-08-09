'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type ActionType =
  | 'login'
  | 'logout'
  | 'invite_sent'
  | 'invite_revoked'
  | 'user_activated'
  | 'user_deactivated'
  | 'user_deleted'
  | 'content_created'
  | 'content_updated'
  | 'content_deleted'
  | 'settings_updated'
  | 'trial_updated'
  | 'enquiry_updated'

export type ActivityLog = {
  id: string
  actor_id: string | null
  actor_email: string
  actor_role: string
  action_type: ActionType
  action_target: string | null
  description: string
  metadata: Record<string, unknown>
  ip_address: string | null
  created_at: string
}

/**
 * Log an admin activity. Call this after any mutating action.
 * Safe to call without awaiting — failures are swallowed silently.
 */
export async function logActivity(
  actorId: string,
  actorEmail: string,
  actorRole: string,
  actionType: ActionType,
  description: string,
  options?: {
    actionTarget?: string
    metadata?: Record<string, unknown>
  },
): Promise<void> {
  try {
    const adminClient = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from('admin_activity_logs').insert({
      actor_id: actorId,
      actor_email: actorEmail,
      actor_role: actorRole,
      action_type: actionType,
      action_target: options?.actionTarget ?? null,
      description,
      metadata: options?.metadata ?? {},
    })
  } catch {
    // Logging should never break the main action
  }
}

/**
 * Log the current admin's login. Called client-side via this server action
 * so it has the authenticated user context.
 */
export async function logAdminLogin(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile) return

    await logActivity(
      profile.id,
      user.email,
      profile.role,
      'login',
      `${user.email} logged in to admin panel`,
    )
  } catch {
    // Swallow
  }
}

/**
 * Fetch all activity logs (superadmin only).
 * Returns logs in descending chronological order.
 */
export async function getActivityLogs(limit = 200): Promise<ActivityLog[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Verify superadmin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || profile.role !== 'superadmin') return []

    const adminClient = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (adminClient as any)
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    return (data ?? []) as ActivityLog[]
  } catch {
    return []
  }
}
