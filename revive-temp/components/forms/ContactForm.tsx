'use client'

import { useState, useCallback, useRef } from 'react'
import { FormField, inputClass } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA'
import { PhoneCTA } from '@/components/ui/PhoneCTA'
import { submitContactEnquiry } from '@/lib/actions/forms'
import {
  validateName,
  validatePhone,
  validateEmail,
  validateSubject,
  validateMessageRequired,
} from '@/lib/validation'

interface FormErrors {
  name?: string | null
  phone?: string | null
  email?: string | null
  subject?: string | null
  message?: string | null
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface ContactFormProps {
  whatsappNumber?: string | null
  phone?: string | null
}

export function ContactForm({ whatsappNumber, phone }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FormErrors>({})

  const [values, setValues] = useState({
    name: '',
    phone: '+91 ',
    email: '',
    subject: '',
    message: '',
  })

  const isSubmittingRef = useRef(false)

  const handleChange = useCallback(
    (field: keyof typeof values) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
      },
    [errors]
  )

  function validate(): FormErrors {
    return {
      name: validateName(values.name),
      // Phone is required
      phone: validatePhone(values.phone),
      email: validateEmail(values.email, true),
      subject: validateSubject(values.subject),
      message: validateMessageRequired(values.message, 5000),
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isSubmittingRef.current || formState === 'submitting') return
    isSubmittingRef.current = true

    const validationErrors = validate()
    const hasErrors = Object.values(validationErrors).some(Boolean)
    if (hasErrors) {
      setErrors(validationErrors)
      isSubmittingRef.current = false
      const firstErrorField = Object.entries(validationErrors).find(([, v]) => v)?.[0]
      if (firstErrorField) document.getElementById(firstErrorField)?.focus()
      return
    }

    setFormState('submitting')
    setErrors({})

    try {
      const result = await submitContactEnquiry({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      })

      if (result.success) {
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

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  if (formState === 'success') {
    return (
      <div className="flex flex-col gap-8" role="status" aria-live="polite">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-[#ff571a] flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#ff571a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="square" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-primary)] mb-1">
              Message Sent
            </p>
            <h2 className="font-[family-name:var(--font-outfit)] font-black text-[var(--color-on-background)] text-3xl uppercase tracking-[-0.02em] leading-tight">
              MESSAGE RECEIVED
            </h2>
          </div>
        </div>

        <div className="border border-white/10 p-6 bg-[#1a1c1b]">
          <p className="font-[family-name:var(--font-body)] text-base text-[#bab8b7] leading-relaxed">
            Thanks for contacting Revive Fight Club. We&apos;ve received your message and will get back to you soon.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <WhatsAppCTA
            whatsappNumber={whatsappNumber ?? null}
            context="contact"
            variant="secondary"
            label="WHATSAPP US"
          />
          <PhoneCTA phone={phone ?? null} variant="secondary" label="CALL US" />
        </div>
      </div>
    )
  }

  // ── ERROR ────────────────────────────────────────────────────────────────
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
            <p className="font-[family-name:var(--font-body)] text-sm text-[#c8c6c5] mt-1">
              Please try again or reach us directly.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => setFormState('idle')}
            className="w-full sm:w-auto"
          >
            TRY AGAIN
          </Button>
          <WhatsAppCTA
            whatsappNumber={whatsappNumber ?? null}
            context="contact"
            variant="secondary"
            label="WHATSAPP"
          />
          <PhoneCTA phone={phone ?? null} variant="secondary" label="CALL" />
        </div>
      </div>
    )
  }

  // ── FORM ─────────────────────────────────────────────────────────────────
  const isPending = formState === 'submitting'

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField id="name" label="Full Name" error={errors.name} required>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
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
            inputMode="tel"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <FormField id="email" label="Email Address" error={errors.email} required>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            placeholder="your@email.com"
            value={values.email}
            onChange={handleChange('email')}
            className={inputClass(!!errors.email)}
            aria-required="true"
            aria-invalid={!!errors.email}
            disabled={isPending}
          />
        </FormField>

        <FormField id="subject" label="Subject" error={errors.subject} required>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="What's this about?"
            value={values.subject}
            onChange={handleChange('subject')}
            className={inputClass(!!errors.subject)}
            aria-required="true"
            aria-invalid={!!errors.subject}
            disabled={isPending}
          />
        </FormField>
      </div>

      <FormField id="message" label="Message" error={errors.message} required>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us how we can help..."
          value={values.message}
          onChange={handleChange('message')}
          className={`${inputClass(!!errors.message)} !h-auto resize-none`}
          maxLength={5000}
          aria-required="true"
          aria-invalid={!!errors.message}
          disabled={isPending}
        />
        <p className="mt-1 text-right font-[family-name:var(--font-body)] text-xs text-[#c8c6c5]/40">
          {values.message.length}/5000
        </p>
      </FormField>

      <div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
          aria-live="polite"
        >
          {isPending ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              SENDING...
            </span>
          ) : (
            'SEND MESSAGE'
          )}
        </Button>
      </div>
    </form>
  )
}
