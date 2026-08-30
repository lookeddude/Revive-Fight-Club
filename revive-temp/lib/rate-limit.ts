import 'server-only'

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

// Untyped admin client for rate limiting table (not in generated Database types)
function getRateLimitClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase rate-limit config')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// ── Rate Limit Configuration ──────────────────────────────────────────
// Centralized constants — tune based on actual traffic patterns.

export const RATE_LIMITS = {
  // CRITICAL — Payment
  PAYMENT_CREATE:  { limit: 5,  windowMs: 10 * 60 * 1000, endpoint: 'payment:create'  },
  PAYMENT_VERIFY:  { limit: 10, windowMs: 10 * 60 * 1000, endpoint: 'payment:verify'  },

  // HIGH — Public forms
  TRIAL_BOOKING:   { limit: 5,  windowMs: 60 * 60 * 1000, endpoint: 'trial:booking'   },
  CONTACT_FORM:    { limit: 5,  windowMs: 60 * 60 * 1000, endpoint: 'contact:form'    },

  // CRITICAL — Auth
  AUTH_CALLBACK:   { limit: 10, windowMs: 15 * 60 * 1000, endpoint: 'auth:callback'   },

  // HIGH — Admin APIs
  ADMIN_UPLOAD:    { limit: 30, windowMs: 60 * 1000,      endpoint: 'admin:upload'    },
  ADMIN_VIDEO:     { limit: 10, windowMs: 60 * 1000,      endpoint: 'admin:video'     },
  ADMIN_API:       { limit: 60, windowMs: 60 * 1000,      endpoint: 'admin:api'       },

  // Workshop endpoints
  WORKSHOP_REGISTER: { limit: 5,  windowMs: 60 * 60 * 1000, endpoint: 'workshop:register'  },
  WORKSHOP_PAYMENT:  { limit: 5,  windowMs: 10 * 60 * 1000, endpoint: 'workshop:payment'   },
  WORKSHOP_QR_VERIFY:{ limit: 20, windowMs: 60 * 1000,      endpoint: 'workshop:qr-verify' },
} as const

export type RateLimitConfig = (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS]

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds?: number
}

// ── IP Resolution ─────────────────────────────────────────────────────
// Extracts client IP from trusted proxy headers.
// Vercel: x-forwarded-for is set by Vercel's edge (trusted).
// Hostinger/Nginx: configure proxy_set_header X-Real-IP.
// NEVER trust arbitrary client-supplied identity headers.

export function getClientIp(req: Request): string {
  // Next.js Request may have 'ip' property (Vercel)
  const nextReq = req as Request & { ip?: string }
  if (nextReq.ip) return nextReq.ip

  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // Take the first IP (client IP from the outermost trusted proxy)
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}

// For Server Actions: extract IP from next/headers
export async function getClientIpFromHeaders(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = h.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

// ── Core Rate Limiter ─────────────────────────────────────────────────
// Supabase-backed sliding window rate limiter.
// Each call: COUNT existing entries in window → if under limit, INSERT new entry.
// Distributed-safe: works across all serverless/PM2 instances.

export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { limit, windowMs, endpoint } = config
  const windowStart = new Date(Date.now() - windowMs).toISOString()
  const expiresAt = new Date(Date.now() + windowMs).toISOString()

  try {
    const supabase = getRateLimitClient()

    // Count existing requests in the sliding window
    const { count, error: countError } = await supabase
      .from('rate_limit_entries')
      .select('*', { count: 'exact', head: true })
      .eq('key', key)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart)

    if (countError) {
      console.error('[rate-limit] count error:', countError.message)
      // Fail behavior depends on endpoint category
      // For critical endpoints: fail-closed (deny)
      // For admin: fail-open (allow)
      if (endpoint.startsWith('admin:') || endpoint.startsWith('auth:')) {
        return { allowed: true, remaining: limit }
      }
      return { allowed: false, remaining: 0, retryAfterSeconds: 60 }
    }

    const currentCount = count ?? 0

    if (currentCount >= limit) {
      // Calculate when the oldest entry in the window expires
      const { data: oldest } = await supabase
        .from('rate_limit_entries')
        .select('created_at')
        .eq('key', key)
        .eq('endpoint', endpoint)
        .gte('created_at', windowStart)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      let retryAfterSeconds = Math.ceil(windowMs / 1000)
      if (oldest?.created_at) {
        const oldestTime = new Date(oldest.created_at).getTime()
        const expiresIn = (oldestTime + windowMs) - Date.now()
        retryAfterSeconds = Math.max(1, Math.ceil(expiresIn / 1000))
      }

      console.warn(
        `[rate-limit] BLOCKED | endpoint=${endpoint} key=${key.substring(0, 40)}... ` +
        `count=${currentCount}/${limit} retry=${retryAfterSeconds}s`
      )

      return { allowed: false, remaining: 0, retryAfterSeconds }
    }

    // Insert new entry
    const { error: insertError } = await supabase
      .from('rate_limit_entries')
      .insert({
        key,
        endpoint,
        expires_at: expiresAt,
      })

    if (insertError) {
      console.error('[rate-limit] insert error:', insertError.message)
      // Still allow the request — the count check passed
    }

    return { allowed: true, remaining: limit - currentCount - 1 }
  } catch (err) {
    console.error('[rate-limit] unexpected error:', err)
    // Fail behavior: critical endpoints fail-closed, admin fail-open
    if (endpoint.startsWith('admin:') || endpoint.startsWith('auth:')) {
      return { allowed: true, remaining: limit }
    }
    return { allowed: false, remaining: 0, retryAfterSeconds: 60 }
  }
}

// ── 429 Response Helper ───────────────────────────────────────────────

export function rateLimitResponse(retryAfterSeconds?: number) {
  const headers: Record<string, string> = {}
  if (retryAfterSeconds) {
    headers['Retry-After'] = String(retryAfterSeconds)
  }

  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  )
}

// ── Cleanup Function ──────────────────────────────────────────────────
// Call periodically (e.g., via cron or after each rate-limit check)
// to prevent table bloat. Safe to run concurrently.

export async function cleanupExpiredEntries(): Promise<number> {
  try {
    const supabase = getRateLimitClient()
    const { error } = await supabase
      .from('rate_limit_entries')
      .delete()
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.error('[rate-limit] cleanup error:', error.message)
      return 0
    }
    return 1 // success indicator
  } catch {
    return 0
  }
}
