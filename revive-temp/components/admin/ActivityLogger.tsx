'use client'

import { useEffect, useRef } from 'react'
import { logAdminLogin } from '@/lib/actions/admin/activityLog'

/**
 * Invisible component that fires a login log entry once per browser session.
 * Uses sessionStorage so it only logs once even across page navigations,
 * but re-logs after the browser tab is closed and reopened.
 */
export function ActivityLogger() {
  const hasLogged = useRef(false)

  useEffect(() => {
    const SESSION_KEY = 'rfc_admin_login_logged'
    if (hasLogged.current) return
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) return

    hasLogged.current = true
    if (typeof window !== 'undefined') sessionStorage.setItem(SESSION_KEY, '1')

    // Pass browser userAgent so device info can be stored
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    logAdminLogin(ua).catch(() => {})
  }, [])

  return null
}
