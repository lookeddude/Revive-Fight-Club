'use client'

import React, { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  /** Fraction of element visible before triggering (default: 0.12) */
  threshold?: number
  /** Shrink bottom of root by Xpx — reveals slightly before element reaches viewport bottom (default: '-48px') */
  rootMargin?: string
  /** Fire only once (default: true) */
  once?: boolean
}

/**
 * Returns [ref, inView].
 * Attach ref to the element you want to observe.
 * inView becomes true when the element enters the viewport.
 */
export function useInView<T extends Element = Element>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.12, rootMargin = '0px 0px -48px 0px', once = true } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      // Fallback: treat as always visible (e.g. SSR, old browsers)
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
