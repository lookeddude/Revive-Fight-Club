import 'server-only'
import crypto from 'crypto'

const QR_SECRET = process.env.WORKSHOP_QR_SECRET ?? 'workshop-qr-fallback-secret-change-me'

/**
 * Generate a secure QR token for a workshop registration.
 * The token encodes registrationId + workshopId signed with HMAC-SHA256.
 * No PII is stored in the token.
 */
export function generateQrToken(registrationId: string, workshopId: string): string {
  const payload = Buffer.from(`${registrationId}.${workshopId}`).toString('base64url')
  const hmac = crypto
    .createHmac('sha256', QR_SECRET)
    .update(payload)
    .digest('base64url')
  return `${payload}.${hmac}`
}

/**
 * Verify a QR token. Returns { valid, registrationId, workshopId } or { valid: false }
 */
export function verifyQrToken(token: string): {
  valid: boolean
  registrationId?: string
  workshopId?: string
} {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return { valid: false }

    const [payload, signature] = parts
    const expectedHmac = crypto
      .createHmac('sha256', QR_SECRET)
      .update(payload)
      .digest('base64url')

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedHmac)
    )) {
      return { valid: false }
    }

    const decoded = Buffer.from(payload, 'base64url').toString('utf8')
    const dotIndex = decoded.indexOf('.')
    if (dotIndex === -1) return { valid: false }

    return {
      valid: true,
      registrationId: decoded.substring(0, dotIndex),
      workshopId: decoded.substring(dotIndex + 1),
    }
  } catch {
    return { valid: false }
  }
}

/**
 * Generate a QR code as a data URL (PNG, base64-encoded).
 * Uses the `qrcode` npm package — server-side only.
 */
export async function generateQrDataUrl(data: string): Promise<string> {
  const QRCode = await import('qrcode')
  return QRCode.default.toDataURL(data, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0E0C10',
      light: '#FCFDFD',
    },
  })
}
