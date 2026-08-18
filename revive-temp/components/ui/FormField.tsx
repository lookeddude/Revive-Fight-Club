interface FormFieldProps {
  id: string
  label: string
  error?: string | null
  required?: boolean
  optional?: boolean
  children: React.ReactNode
}

/**
 * Wrapper for form fields — provides consistent label, error message,
 * and ARIA association between error and input.
 */
export function FormField({ id, label, error, required, optional, children }: FormFieldProps) {
  const errorId = `${id}-error`
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-[family-name:var(--font-body)] text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-on-background)] mb-3"
      >
        {label}
        {optional && (
          <span className="ml-2 font-normal normal-case tracking-normal text-[var(--color-on-surface-variant)]">
            (optional)
          </span>
        )}
        {required && <span className="ml-1 text-[var(--color-primary)]" aria-hidden="true">*</span>}
      </label>
      {/* Clone children to inject aria-describedby when error exists */}
      <div aria-describedby={error ? errorId : undefined}>
        {children}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 font-[family-name:var(--font-body)] text-xs text-[var(--color-secondary)] flex items-center gap-1"
        >
          <svg className="w-3 h-3 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

/** Shared input class — solid mature input style */
export function inputClass(hasError: boolean): string {
  return `w-full px-4 py-3 border text-[var(--color-on-background)] placeholder-[var(--color-on-surface-variant)] font-[family-name:var(--font-body)] text-base bg-[var(--color-surface)] rounded-none outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-colors${
    hasError 
      ? ' border-[var(--color-secondary)] focus:border-[var(--color-secondary)]' 
      : ' border-[var(--color-outline-variant)] focus:border-[var(--color-primary)]'
  }`
}
