import 'server-only'
import Razorpay from 'razorpay'

/**
 * Server-only Razorpay client
 * NEVER import this in client components or NEXT_PUBLIC_ context
 */
function createRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error(
      'Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET. ' +
      'Add these to .env.local — never prefix with NEXT_PUBLIC_'
    )
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

// Lazy singleton — only instantiated when first used
let _client: Razorpay | null = null

export function getRazorpay(): Razorpay {
  if (!_client) _client = createRazorpayClient()
  return _client
}

/** Convert rupees to paise (Razorpay uses smallest currency unit) */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

/** Format paise back to rupees for display */
export function paiseToRupees(paise: number): number {
  return paise / 100
}

/** Verify Razorpay payment signature (HMAC SHA256) */
export async function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}): Promise<boolean> {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false

  const { createHmac, timingSafeEqual } = await import('crypto')
  const body = `${orderId}|${paymentId}`
  const expectedSignature = createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  // Timing-safe comparison prevents side-channel attacks
  if (expectedSignature.length !== signature.length) return false
  return timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
}

/** Verify Razorpay webhook signature */
export async function verifyWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string
  signature: string
}): Promise<boolean> {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false

  const { createHmac, timingSafeEqual } = await import('crypto')
  const expectedSignature = createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  // Timing-safe comparison prevents side-channel attacks
  if (expectedSignature.length !== signature.length) return false
  return timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
}
