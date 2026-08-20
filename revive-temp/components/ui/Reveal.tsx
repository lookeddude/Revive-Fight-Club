'use client'

import React, { type CSSProperties, type ElementType } from 'react'
import { useInView } from '@/hooks/useInView'

interface RevealProps {
  children: React.ReactNode
  /** Extra classes applied to the wrapper element */
  className?: string
  /** Animation delay in ms (default: 0) */
  delay?: number
  /** Animation direction (default: 'up') */
  direction?: 'up' | 'fade' | 'left'
  /** IntersectionObserver threshold (default: 0.12) */
  threshold?: number
  /** HTML tag to render as wrapper (default: 'div') */
  as?: ElementType
}

/**
 * Scroll-reveal wrapper.
 * Wraps children in a div (or specified tag) that fades/slides in
 * when it enters the viewport. Uses CSS transitions — zero runtime
 * JavaScript after mount.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.12,
  as: Tag = 'div',
}: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold })

  const classes = [
    `rfc-reveal--${direction}`,
    inView ? 'rfc-in-view' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const style: CSSProperties = delay
    ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties)
    : {}

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={classes} style={style}>
      {children}
    </Tag>
  )
}
