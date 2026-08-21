import 'server-only'

/**
 * Email service — Resend
 * Sends transactional emails for payment confirmations.
 * Email failure NEVER reverses a successful payment.
 */

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@revivefightclub.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — email not sent')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: `Revive Fight Club <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('[email] send failed:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('[email] unexpected error:', err)
    return { success: false, error: 'Email service error' }
  }
}

// ── Membership Confirmation ────────────────────────────────────

export interface MembershipEmailData {
  customerName: string
  customerEmail: string
  planName: string
  amount: number        // in rupees
  startDate: string
  endDate: string
  referenceId: string
  billingPeriod: string
}

export async function sendMembershipConfirmation(data: MembershipEmailData) {
  const subject = `Membership Confirmed — Revive Fight Club`
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Membership Confirmed</title></head>
    <body style="font-family: Arial, sans-serif; background: #0d0c0b; color: #f0ede8; margin: 0; padding: 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: #111210; border: 1px solid rgba(255,87,26,0.25); padding: 32px;">
        
        <div style="border-bottom: 2px solid #ff571a; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #ff571a; font-size: 22px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
            REVIVE FIGHT CLUB
          </h1>
          <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">
            Membership Confirmation
          </p>
        </div>

        <h2 style="color: #f0ede8; font-size: 18px; margin: 0 0 8px;">
          Welcome to the Team, ${data.customerName}! 🥊
        </h2>
        <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Your membership payment has been verified and your membership is now <strong style="color: #22c55e;">active</strong>.
        </p>

        <div style="background: rgba(255,87,26,0.08); border: 1px solid rgba(255,87,26,0.2); padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="color: #9ca3af; padding: 6px 0;">Plan</td>
                <td style="color: #f0ede8; text-align: right; font-weight: bold;">${data.planName}</td></tr>
            <tr><td style="color: #9ca3af; padding: 6px 0;">Duration</td>
                <td style="color: #f0ede8; text-align: right;">${data.billingPeriod}</td></tr>
            <tr><td style="color: #9ca3af; padding: 6px 0;">Amount Paid</td>
                <td style="color: #ff571a; text-align: right; font-weight: bold; font-size: 16px;">₹${data.amount.toLocaleString('en-IN')}</td></tr>
            <tr><td style="color: #9ca3af; padding: 6px 0;">Valid From</td>
                <td style="color: #f0ede8; text-align: right;">${data.startDate}</td></tr>
            <tr><td style="color: #9ca3af; padding: 6px 0;">Valid Until</td>
                <td style="color: #f0ede8; text-align: right;">${data.endDate}</td></tr>
            <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #6b7280; padding: 8px 0 0; font-size: 12px;">Reference</td>
              <td style="color: #6b7280; text-align: right; font-size: 12px; padding: 8px 0 0;">${data.referenceId}</td>
            </tr>
          </table>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 16px; margin-bottom: 24px;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">📍 Find Us</p>
          <p style="color: #c4c0bb; font-size: 13px; line-height: 1.6; margin: 0;">
            3rd Floor, 157, MM Road, above Indian Overseas Bank,<br>
            Fraser Town, Bengaluru, Karnataka 560005
          </p>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
          Questions? WhatsApp us at <a href="https://wa.me/919606972238" style="color: #ff571a;">+91 96069 72238</a>
        </p>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to: data.customerEmail, subject, html })
}

// ── Trial Booking Confirmation ─────────────────────────────────

export interface TrialEmailData {
  customerName: string
  customerEmail: string
  programName: string
  preferredDate?: string | null
  preferredTime?: string | null
  amount: number        // in rupees
  referenceId: string
}

export async function sendTrialConfirmation(data: TrialEmailData) {
  const subject = `Trial Booking Confirmed — Revive Fight Club`
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Trial Confirmed</title></head>
    <body style="font-family: Arial, sans-serif; background: #0d0c0b; color: #f0ede8; margin: 0; padding: 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: #111210; border: 1px solid rgba(255,87,26,0.25); padding: 32px;">
        
        <div style="border-bottom: 2px solid #ff571a; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #ff571a; font-size: 22px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
            REVIVE FIGHT CLUB
          </h1>
          <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">
            Trial Booking Confirmed
          </p>
        </div>

        <h2 style="color: #f0ede8; font-size: 18px; margin: 0 0 8px;">
          You're Booked, ${data.customerName}! 🔥
        </h2>
        <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Your trial session payment has been confirmed. Our team will contact you within 24 hours to confirm your exact session time.
        </p>

        <div style="background: rgba(255,87,26,0.08); border: 1px solid rgba(255,87,26,0.2); padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="color: #9ca3af; padding: 6px 0;">Program</td>
                <td style="color: #f0ede8; text-align: right; font-weight: bold;">${data.programName}</td></tr>
            ${data.preferredDate ? `<tr><td style="color: #9ca3af; padding: 6px 0;">Preferred Date</td>
                <td style="color: #f0ede8; text-align: right;">${data.preferredDate}</td></tr>` : ''}
            ${data.preferredTime ? `<tr><td style="color: #9ca3af; padding: 6px 0;">Preferred Time</td>
                <td style="color: #f0ede8; text-align: right;">${data.preferredTime}</td></tr>` : ''}
            <tr><td style="color: #9ca3af; padding: 6px 0;">Trial Fee</td>
                <td style="color: #ff571a; text-align: right; font-weight: bold; font-size: 16px;">₹${data.amount.toLocaleString('en-IN')}</td></tr>
            <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #6b7280; padding: 8px 0 0; font-size: 12px;">Reference</td>
              <td style="color: #6b7280; text-align: right; font-size: 12px; padding: 8px 0 0;">${data.referenceId}</td>
            </tr>
          </table>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 16px; margin-bottom: 16px;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">What to Bring</p>
          <ul style="color: #c4c0bb; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 16px;">
            <li>Comfortable workout clothes</li>
            <li>Water bottle</li>
            <li>Towel</li>
            <li>Hand wraps (if available — we have spares)</li>
          </ul>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 16px; margin-bottom: 24px;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">📍 Location</p>
          <p style="color: #c4c0bb; font-size: 13px; line-height: 1.6; margin: 0;">
            3rd Floor, 157, MM Road, above Indian Overseas Bank,<br>
            Fraser Town, Bengaluru, Karnataka 560005
          </p>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
          Questions? WhatsApp us at <a href="https://wa.me/919606972238" style="color: #ff571a;">+91 96069 72238</a>
        </p>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to: data.customerEmail, subject, html })
}
