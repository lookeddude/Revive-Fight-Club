/**
 * Client-side form validation utilities.
 * These do NOT replace server-side validation — they enhance UX only.
 */

export type FieldError = string | null

export function validateName(value: string): FieldError {
  const trimmed = value.trim()
  if (!trimmed) return 'Name is required'
  if (trimmed.length < 2) return 'Name must be at least 2 characters'
  if (trimmed.length > 100) return 'Name must be less than 100 characters'
  return null
}

export function validatePhone(value: string): FieldError {
  const trimmed = value.trim()
  if (!trimmed) return 'Phone number is required'
  // Accept formats: +91 XXXXX XXXXX, 10-digit, international
  const digits = trimmed.replace(/[\s\-\(\)\+]/g, '')
  if (digits.length < 7) return 'Enter a valid phone number'
  if (digits.length > 15) return 'Phone number is too long'
  if (!/^\d+$/.test(digits)) return 'Phone number should contain only digits'
  return null
}

export function validateEmail(value: string, required = true): FieldError {
  const trimmed = value.trim()
  if (!trimmed) {
    return required ? 'Email is required' : null
  }
  const emailRegex = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/
  if (!emailRegex.test(trimmed)) return 'Enter a valid email address'
  return null
}

export function validateDate(value: string): FieldError {
  if (!value) return 'Preferred date is required'
  const selected = new Date(value)
  if (isNaN(selected.getTime())) return 'Enter a valid date'
  // Compare date-only (ignore time) to today in local timezone
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (selected < today) return 'Please select a future date'
  // Don't allow dates more than 90 days out
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 90)
  if (selected > maxDate) return 'Please select a date within the next 90 days'
  return null
}

export function validateTime(value: string): FieldError {
  if (!value) return 'Preferred time is required'
  return null
}

export function validateMessage(value: string, maxLength = 2000): FieldError {
  if (value.length > maxLength) return `Message must be less than ${maxLength} characters`
  return null
}

export function validateSubject(value: string): FieldError {
  const trimmed = value.trim()
  if (!trimmed) return 'Subject is required'
  if (trimmed.length < 3) return 'Subject must be at least 3 characters'
  if (trimmed.length > 200) return 'Subject is too long'
  return null
}

export function validateMessageRequired(value: string, maxLength = 5000): FieldError {
  const trimmed = value.trim()
  if (!trimmed) return 'Message is required'
  if (trimmed.length < 10) return 'Message must be at least 10 characters'
  if (value.length > maxLength) return `Message must be less than ${maxLength} characters`
  return null
}

/** Get today's date as YYYY-MM-DD for input[type=date] min attribute */
export function getTodayDateString(): string {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Get max date (90 days from now) as YYYY-MM-DD */
export function getMaxDateString(): string {
  const max = new Date()
  max.setDate(max.getDate() + 90)
  const y = max.getFullYear()
  const m = String(max.getMonth() + 1).padStart(2, '0')
  const d = String(max.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
