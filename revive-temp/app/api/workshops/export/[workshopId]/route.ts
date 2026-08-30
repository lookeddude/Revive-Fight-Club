import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/getAdminSession'
import { exportRegistrationsAsCSV } from '@/lib/data/workshopAdmin'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    await requireAdmin()
    const { workshopId } = await params

    if (!workshopId) {
      return NextResponse.json({ error: 'Workshop ID required' }, { status: 400 })
    }

    const csv = await exportRegistrationsAsCSV(workshopId)
    const filename = `workshop-registrations-${workshopId.slice(0, 8)}-${new Date().toISOString().slice(0,10)}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[ws-export] error:', err)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
