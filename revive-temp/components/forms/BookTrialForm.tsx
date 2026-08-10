'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { FormField, inputClass } from '@/components/ui/FormField'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'
import { PhoneCTA } from '@/components/ui/PhoneCTA'
import { submitTrialRequest } from '@/lib/actions/forms'
import {
  validateName,
  validatePhone,
  validateEmail,
  validateDate,
  validateTime,
  validateMessage,
  getTodayDateString,
  getMaxDateString,
} from '@/lib/validation'

type Program = { id: string; name: string; slug: string }

interface FormErrors {
  name?: string | null
  phone?: string | null
  email?: string | null
  program_id?: string | null
  preferred_date?: string | null
  preferred_time?: string | null
  message?: string | null
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface BookTrialFormProps {
  programs: Program[]
  preselectedProgramId?: string | null
  whatsappNumber?: string | null
  phone?: string | null
}

const TIME_SLOTS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM',
]

function timeSlotToHH(slot: string): string {
  const [time, period] = slot.split(' ')
  const [h, m] = time.split(':')
  let hour = parseInt(h)
  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${m}:00`
}

export function BookTrialForm({
  programs,
  preselectedProgramId,
  whatsappNumber,
  phone,
}: BookTrialFormProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  // Track values to preserve them on error
  const [values, setValues] = useState({
    name: '',
    phone: '+91 ',
    email: '',
    program_id: preselectedProgramId ?? '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  })

  // Prevent double-submission
  const isSubmittingRef = useRef(false)

  const handleChange = useCallback(
    (field: keyof typeof values) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }))
        // Clear field error on change
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: null }))
        }
      },
    [errors]
  )

  function validate(): FormErrors {
    return {
      name: validateName(values.name),
      phone: validatePhone(values.phone),
      email: validateEmail(values.email, false), // email optional
      program_id: null, // optional — gym follows up
      preferred_date: values.preferred_date ? validateDate(values.preferred_date) : null,
      preferred_time: null, // optional
      message: validateMessage(values.message),
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Prevent double-submit
    if (isSubmittingRef.current || formState === 'submitting') return
    isSubmittingRef.current = true

    // Client validation
    const validationErrors = validate()
    const hasErrors = Object.values(validationErrors).some(Boolean)
    if (hasErrors) {
      setErrors(validationErrors)
      isSubmittingRef.current = false
      // Focus first error field
      const firstErrorField = Object.entries(validationErrors).find(([, v]) => v)?.[0]
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus()
      }
      return
    }

    setFormState('submitting')
    setErrors({})

    try {
      const result = await submitTrialRequest({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        program_id: values.program_id || null,
        preferred_date: values.preferred_date || null,
        preferred_time: values.preferred_time ? timeSlotToHH(values.preferred_time) : null,
        message: values.message.trim() || null,
      })

      if (result.success) {
        setSubmittedId(result.id)
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    } finally {
      isSubmittingRef.current = false
    }
  }

  // ── SUCCESS STATE ──────────────────────────────────────────────────────────
  if (formState === 'success') {
    return (
      <div className="flex flex-col gap-8" role="status" aria-live="polite">
        {/* Success Icon */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-[#ff571a] flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#ff571a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#ffb59e] mb-1">
              Request Received
            </p>
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-3xl uppercase tracking-tight">
              TRIAL REQUEST SENT
            </h2>
          </div>
        </div>

        <div className="border border-white/10 p-6 bg-[#1a1c1b]">
          <p className="font-[family-name:var(--font-inter)] text-base text-[#bab8b7] leading-relaxed">
            Your trial request has been received. The Revive Fight Club team will contact you within 
            24 hours to confirm your session details.
          </p>
        </div>

        <div className="border-l-2 border-[#ff571a] pl-4">
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5]">
            Want to confirm faster? Reach us directly on WhatsApp or call us now.
          </p>
        </div>

        {/* Next actions */}
        <div className="flex flex-wrap gap-4">
          <WhatsAppCTA
            whatsappNumber={whatsappNumber ?? null}
            context="trial"
            variant="secondary"
            label="WHATSAPP REVIVE"
          />
          <PhoneCTA phone={phone ?? null} variant="secondary" label="CALL NOW" />
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 border border-white/10 text-[#e2e3e1] font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-[#383a38] transition-all duration-300"
          >
            BACK TO PROGRAMS
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#c8c6c5] font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase hover:text-[#e2e3e1] transition-colors py-4"
          >
            BACK TO HOME
          </Link>
        </div>

        {/* Reference */}
        {submittedId && (
          <p className="font-[family-name:var(--font-inter)] text-xs text-[#c8c6c5]/40">
            Ref: {submittedId.slice(0, 8).toUpperCase()}
          </p>
        )}
      </div>
    )
  }

  // ── ERROR STATE ────────────────────────────────────────────────────────────
  if (formState === 'error') {
    return (
      <div className="flex flex-col gap-8" role="alert" aria-live="assertive">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-[#ff8c6b] flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#ff8c6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-outfit)] font-bold text-[#e2e3e1] text-2xl uppercase">
              SOMETHING WENT WRONG
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-sm text-[#c8c6c5] mt-1">
              Please try again or contact us directly.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFormState('idle')}
            className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 active:scale-95"
          >
            TRY AGAIN
          </button>
          <WhatsAppCTA
            whatsappNumber={whatsappNumber ?? null}
            context="trial"
            variant="secondary"
            label="WHATSAPP"
          />
          <PhoneCTA phone={phone ?? null} variant="secondary" label="CALL" />
        </div>
      </div>
    )
  }

  // ── FORM STATE (idle / submitting) ─────────────────────────────────────────
  const isPending = formState === 'submitting'

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Book a trial class form"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField id="name" label="Full Name" error={errors.name} required>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={values.name}
            onChange={handleChange('name')}
            className={inputClass(!!errors.name)}
            aria-required="true"
            aria-invalid={!!errors.name}
            disabled={isPending}
          />
        </FormField>

        <FormField id="phone" label="Phone Number" error={errors.phone} required>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={values.phone}
            onChange={handleChange('phone')}
            className={inputClass(!!errors.phone)}
            aria-required="true"
            aria-invalid={!!errors.phone}
            disabled={isPending}
          />
        </FormField>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField id="email" label="Email Address" error={errors.email} optional>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={values.email}
            onChange={handleChange('email')}
            className={inputClass(!!errors.email)}
            aria-required="false"
            aria-invalid={!!errors.email}
            disabled={isPending}
          />
        </FormField>

        <FormField id="program_id" label="Program" error={errors.program_id} required>
          <select
            id="program_id"
            name="program_id"
            value={values.program_id}
            onChange={handleChange('program_id')}
            className={`${inputClass(!!errors.program_id)} appearance-none`}
            aria-required="true"
            aria-invalid={!!errors.program_id}
            disabled={isPending}
          >
            <option value="" className="bg-[#1e201f] text-[#c8c6c5]">Select a program</option>
            {programs.length > 0 ? (
              programs.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1e201f]">
                  {p.name}
                </option>
              ))
            ) : (
              <>
                <option value="mma" className="bg-[#1e201f]">MMA</option>
                <option value="muay-thai" className="bg-[#1e201f]">Muay Thai</option>
                <option value="bjj" className="bg-[#1e201f]">Brazilian Jiu-Jitsu</option>
                <option value="strength" className="bg-[#1e201f]">Strength &amp; Conditioning</option>
                <option value="not-sure" className="bg-[#1e201f]">Not sure yet</option>
              </>
            )}
          </select>
        </FormField>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField id="preferred_date" label="Preferred Date" error={errors.preferred_date} optional>
          <input
            id="preferred_date"
            name="preferred_date"
            type="date"
            value={values.preferred_date}
            onChange={handleChange('preferred_date')}
            min={getTodayDateString()}
            max={getMaxDateString()}
            className={`${inputClass(!!errors.preferred_date)} [color-scheme:dark]`}
            aria-required="false"
            aria-invalid={!!errors.preferred_date}
            disabled={isPending}
          />
        </FormField>

        <FormField id="preferred_time" label="Preferred Time" error={errors.preferred_time} optional>
          <select
            id="preferred_time"
            name="preferred_time"
            value={values.preferred_time}
            onChange={handleChange('preferred_time')}
            className={`${inputClass(!!errors.preferred_time)} appearance-none`}
            aria-required="false"
            aria-invalid={!!errors.preferred_time}
            disabled={isPending}
          >
            <option value="" className="bg-[#1e201f] text-[#c8c6c5]">Any time (gym will confirm)</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot} className="bg-[#1e201f]">
                {slot}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Message */}
      <FormField id="message" label="Anything else?" error={errors.message} optional>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Experience level, goals, injuries, questions..."
          value={values.message}
          onChange={handleChange('message')}
          className={`${inputClass(!!errors.message)} resize-none`}
          maxLength={2000}
          disabled={isPending}
        />
        <p className="mt-1 text-right font-[family-name:var(--font-inter)] text-xs text-[#c8c6c5]/40">
          {values.message.length}/2000
        </p>
      </FormField>

      {/* Notice */}
      <p className="font-[family-name:var(--font-inter)] text-xs text-[#c8c6c5]/60 leading-relaxed">
        * This is a trial request — not an automatic booking. Revive Fight Club will confirm your 
        session by phone or WhatsApp within 24 hours.
      </p>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#ff571a] text-black font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.1em] uppercase px-8 py-4 hover:bg-white transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[220px]"
          aria-live="polite"
        >
          {isPending ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              REQUESTING TRIAL...
            </span>
          ) : (
            'BOOK MY TRIAL CLASS'
          )}
        </button>
      </div>
    </form>
  )
}
