import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { markAttendance } from '@/lib/actions/admin/workshopRegistrationActions'

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await req.json()
    const { registrationId, workshopId } = body

    if (!registrationId || !workshopId) {
      return NextResponse.json({ error: 'Missing registrationId or workshopId' }, { status: 400 })
    }

    const result = await markAttendance(registrationId, workshopId, session.id, 'attended')
    if (!result.success) {
      if (result.error === 'ALREADY_ATTENDED') {
        return NextResponse.json({ error: 'Already marked as attended' }, { status: 409 })
      }
      return NextResponse.json({ error: result.error ?? 'Failed to mark attendance' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[mark-attendance] error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
