import 'server-only'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@revivefightclub.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn('[workshop-email] RESEND_API_KEY not set')
    return { success: false }
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
    if (error) { console.error('[workshop-email] error:', error); return { success: false } }
    return { success: true }
  } catch (err) {
    console.error('[workshop-email] unexpected:', err)
    return { success: false }
  }
}

export interface WorkshopConfirmationData {
  customerName: string
  customerEmail: string
  workshopTitle: string
  startDatetime: string
  endDatetime: string
  location: string | null
  workshopMode: string
  registrationId: string
  pricingType: 'free' | 'paid'
  amountPaid?: number
  qrDataUrl?: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export async function sendWorkshopConfirmation(data: WorkshopConfirmationData) {
  const qrSection = data.qrDataUrl
    ? `<div style="text-align:center;margin:24px 0"><img src="${data.qrDataUrl}" width="200" alt="QR Code" style="border:4px solid #0E0C10;padding:8px;background:#fff" /></div>`
    : ''

  const paymentSection = data.pricingType === 'paid' && data.amountPaid
    ? `<tr><td style="padding:8px 0;color:#9ca3af;font-size:14px">Amount Paid</td><td style="padding:8px 0;font-weight:bold;font-size:14px">₹${data.amountPaid.toLocaleString('en-IN')}</td></tr>`
    : ''

  const locationLine = data.workshopMode === 'online'
    ? 'Online Workshop'
    : (data.location ?? 'Revive Fight Club, Bengaluru')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Workshop Registration Confirmed</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#0E0C10;border-radius:8px;overflow:hidden">
    <!-- Header -->
    <tr><td style="background:#0E0C10;padding:32px;text-align:center;border-bottom:1px solid #1f1f1f">
      <p style="margin:0;color:#DC2626;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase">REVIVE FIGHT CLUB</p>
      <h1 style="margin:8px 0 0;color:#FCFDFD;font-size:28px;font-weight:900;letter-spacing:-0.02em">Registration Confirmed ✓</h1>
    </td></tr>
    <!-- Body -->
    <tr><td style="padding:32px">
      <p style="color:#9ca3af;font-size:15px;margin:0 0 24px">Hi ${data.customerName},</p>
      <p style="color:#FCFDFD;font-size:15px;margin:0 0 24px">You're registered for <strong style="color:#FCFDFD">${data.workshopTitle}</strong>. See you there!</p>
      <!-- Details table -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1f1f1f;border-bottom:1px solid #1f1f1f;margin:0 0 24px">
        <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px">Date &amp; Time</td><td style="padding:8px 0;font-weight:bold;color:#FCFDFD;font-size:14px">${formatDate(data.startDatetime)}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px">Location</td><td style="padding:8px 0;font-weight:bold;color:#FCFDFD;font-size:14px">${locationLine}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af;font-size:14px">Registration ID</td><td style="padding:8px 0;font-weight:bold;color:#DC2626;font-size:14px;letter-spacing:0.05em">${data.registrationId}</td></tr>
        ${paymentSection}
      </table>
      <!-- QR Code -->
      ${qrSection}
      <p style="color:#6b7280;font-size:13px;text-align:center;margin:0">Present your QR code at the entrance for check-in.</p>
      <!-- CTA -->
      <div style="text-align:center;margin:32px 0">
        <a href="https://revivefightclub.com/workshops" style="background:#DC2626;color:#fff;font-weight:700;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;padding:14px 32px;text-decoration:none;display:inline-block">VIEW ALL WORKSHOPS</a>
      </div>
    </td></tr>
    <!-- Footer -->
    <tr><td style="padding:20px 32px;text-align:center;border-top:1px solid #1f1f1f">
      <p style="margin:0;color:#4b5563;font-size:12px">Revive Fight Club | Fraser Town, Bengaluru</p>
    </td></tr>
  </table>
  </td></tr>
</table>
</body></html>`

  const subject = data.pricingType === 'paid'
    ? `Payment Confirmed — ${data.workshopTitle}`
    : `Registration Confirmed — ${data.workshopTitle}`

  return sendEmail(data.customerEmail, subject, html)
}

export async function sendWorkshopAdminNotification(data: {
  adminEmail: string
  workshopTitle: string
  participantName: string
  participantEmail: string
  registrationId: string
  pricingType: 'free' | 'paid'
  amountPaid?: number
}) {
  const html = `
<html><body style="font-family:Arial,sans-serif;background:#f3f4f6;padding:20px">
<div style="background:#fff;border-radius:8px;padding:24px;max-width:500px">
  <h2 style="margin:0 0 16px;color:#0E0C10;font-size:18px">New Workshop Registration</h2>
  <table width="100%">
    <tr><td style="color:#6b7280;font-size:14px;padding:4px 0">Workshop</td><td style="font-weight:bold;font-size:14px;padding:4px 0">${data.workshopTitle}</td></tr>
    <tr><td style="color:#6b7280;font-size:14px;padding:4px 0">Participant</td><td style="font-size:14px;padding:4px 0">${data.participantName}</td></tr>
    <tr><td style="color:#6b7280;font-size:14px;padding:4px 0">Email</td><td style="font-size:14px;padding:4px 0">${data.participantEmail}</td></tr>
    <tr><td style="color:#6b7280;font-size:14px;padding:4px 0">Registration ID</td><td style="font-weight:bold;color:#DC2626;font-size:14px;padding:4px 0">${data.registrationId}</td></tr>
    <tr><td style="color:#6b7280;font-size:14px;padding:4px 0">Type</td><td style="font-size:14px;padding:4px 0;text-transform:uppercase">${data.pricingType}${data.pricingType === 'paid' && data.amountPaid ? ` — ₹${data.amountPaid.toLocaleString('en-IN')}` : ''}</td></tr>
  </table>
  <a href="https://revivefightclub.com/admin/workshops" style="display:inline-block;margin-top:16px;background:#0E0C10;color:#fff;padding:10px 20px;font-size:13px;text-decoration:none;border-radius:4px">View in Admin</a>
</div></body></html>`

  return sendEmail(data.adminEmail, `New Registration: ${data.workshopTitle}`, html)
}
