'use client'

import { useState } from 'react'
import Link from 'next/link'

interface RegistrationResult {
  id: string
  registrationId?: string
  fullName?: string
  name?: string
  email?: string
  phone?: string
  status: string
  paymentStatus?: string
  payment_status?: string
  attendanceMarkedAt?: string | null
}

export default function WorkshopAttendancePage({ params }: { params: { id: string } }) {
  const [token, setToken] = useState('')
  const [result, setResult] = useState<RegistrationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    setResult(null)

    try {
      const trimmed = token.trim()
      const payload = trimmed.toUpperCase().startsWith('RFC')
        ? { registrationId: trimmed }
        : { token: trimmed, registrationId: trimmed }

      const res = await fetch('/api/workshops/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to verify')
      } else {
        setResult(data.registration)
        if (data.registration?.status === 'attended') {
          setSuccess('Already marked as attended')
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error communicating with server')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async () => {
    if (!result) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const markRes = await fetch('/api/admin/workshops/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: result.id, workshopId: params.id })
      })
      const data = await markRes.json()
      if (data.success) {
        setSuccess('Attendance marked successfully!')
        setResult({ ...result, status: 'attended' })
      } else {
        setError(data.error || 'Failed to mark attendance')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error marking attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-8">
      <div className="text-center">
        <Link href={`/admin/workshops/${params.id}/registrations`} className="font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-wider text-[#9ca3af] hover:text-white transition-colors mb-4 inline-block">
          &larr; Back to Registrations
        </Link>
        <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl uppercase tracking-tight">QR Check-in</h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280] mt-1">Manual ID entry mode</p>
      </div>

      <div className="bg-[#111312] border border-white/[0.07] p-8">
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <label className="font-[family-name:var(--font-body)] text-sm font-bold text-[#e2e3e1] uppercase tracking-wider block text-center">
              Scan QR or Enter Token
            </label>
            <input
              required
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="e.g. 123e4567-e89b-12d3-a456..."
              className="w-full px-4 py-4 bg-white/[0.02] border border-white/[0.07] text-lg text-center text-[#e2e3e1] focus:border-[#ff571a]/50 focus:outline-none font-mono"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-[#ff571a] text-black font-[family-name:var(--font-body)] text-lg font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify Token'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-center text-sm font-medium">
            {error}
          </div>
        )}

        {success && !error && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-center text-sm font-medium">
            {success}
          </div>
        )}

        {result && (
          <div className="mt-6 border-t border-white/[0.07] pt-6 space-y-4">
            <div className="text-center">
              <h3 className="font-[family-name:var(--font-outfit)] font-bold text-xl text-[#e2e3e1]">{result.fullName || result.name}</h3>
              <p className="font-[family-name:var(--font-body)] text-sm text-[#6b7280]">{result.email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center border border-white/[0.07] bg-white/[0.02] p-4">
              <div>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] uppercase tracking-wider mb-1">Status</p>
                <p className={`font-[family-name:var(--font-outfit)] font-bold text-lg uppercase ${
                  result.status === 'attended' ? 'text-blue-400' :
                  result.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {result.status}
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#6b7280] uppercase tracking-wider mb-1">Payment</p>
                <p className={`font-[family-name:var(--font-outfit)] font-bold text-lg uppercase ${
                  (result.paymentStatus || result.payment_status) === 'completed' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {result.paymentStatus || result.payment_status}
                </p>
              </div>
            </div>

            {result.status !== 'attended' && (
              <button 
                onClick={handleMarkAttendance} 
                disabled={loading}
                className="w-full py-4 border-2 border-[#ff571a] text-[#ff571a] font-[family-name:var(--font-body)] text-lg font-bold uppercase tracking-wider hover:bg-[#ff571a] hover:text-black transition-colors disabled:opacity-50"
              >
                {loading ? 'Marking...' : 'Mark as Attended'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
