'use client'

import { useState } from 'react'
import Link from 'next/link'
import { submitTrialRequest } from '@/lib/actions/forms'

export function BookTrialForm() {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setResult(null)

    const form = e.currentTarget
    const data = new FormData(form)

    const response = await submitTrialRequest({
      name: data.get('name') as string,
      phone: data.get('phone') as string,
      email: data.get('email') as string,
      program_id: null,
      preferred_date: null,
      preferred_time: null,
      message: (data.get('message') as string) || null,
    })

    if (response.success) {
      setResult({
        success: true,
        message: "Your request has been received. We'll be in touch within 24 hours.",
      })
      form.reset()
    } else {
      setResult({ success: false, message: response.error })
    }

    setPending(false)
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            className="input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base"
            required
            minLength={2}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 00000 00000"
            className="input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            className="input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base"
            required
          />
        </div>

        <div>
          <label htmlFor="discipline" className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3">
            Interested In
          </label>
          <select
            id="discipline"
            name="discipline"
            className="input-underline w-full py-3 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-base appearance-none bg-transparent"
          >
            <option value="" className="bg-[#1e201f]">Select a discipline</option>
            <option value="mma" className="bg-[#1e201f]">MMA</option>
            <option value="muay-thai" className="bg-[#1e201f]">Muay Thai</option>
            <option value="bjj" className="bg-[#1e201f]">Brazilian Jiu-Jitsu</option>
            <option value="strength" className="bg-[#1e201f]">Strength &amp; Conditioning</option>
            <option value="not-sure" className="bg-[#1e201f]">Not sure yet</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3">
          Anything else? (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Any experience level, injuries, goals..."
          className="input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base resize-none"
          maxLength={2000}
        />
      </div>

      {/* Feedback */}
      {result && (
        <div
          role="alert"
          className={`px-6 py-4 border text-sm font-[family-name:var(--font-inter)] ${
            result.success
              ? 'border-green-500/30 bg-green-500/5 text-green-400'
              : 'border-red-500/30 bg-red-500/5 text-red-400'
          }`}
        >
          {result.message}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'SUBMITTING...' : 'BOOK MY TRIAL CLASS'}
        </button>
      </div>
    </form>
  )
}
