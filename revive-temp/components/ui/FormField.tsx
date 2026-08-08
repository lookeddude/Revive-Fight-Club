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
        className="block font-[family-name:var(--font-inter)] text-xs font-bold tracking-[0.1em] uppercase text-[#e2e3e1] mb-3"
      >
        {label}
        {optional && (
          <span className="ml-2 font-normal normal-case tracking-normal text-[#c8c6c5]">
            (optional)
          </span>
        )}
        {required && <span className="ml-1 text-[#ff571a]" aria-hidden="true">*</span>}
      </label>
      {/* Clone children to inject aria-describedby when error exists */}
      <div aria-describedby={error ? errorId : undefined}>
        {children}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 font-[family-name:var(--font-inter)] text-xs text-[#ff8c6b] flex items-center gap-1"
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

/** Shared input class — combines input-underline with error state */
export function inputClass(hasError: boolean): string {
  return `input-underline w-full py-3 text-[#e2e3e1] placeholder-white/20 font-[family-name:var(--font-inter)] text-base bg-transparent${
    hasError ? ' border-b-[#ff8c6b]' : ''
  }`
}
