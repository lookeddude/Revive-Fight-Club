'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface SlideshowProps {
  images: string[]
  programName: string
}

export function ProgramSlideshow({ images, programName }: SlideshowProps) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = useCallback((index: number) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [current, isAnimating])

  const prev = useCallback(() => {
    goTo(current === 0 ? images.length - 1 : current - 1)
  }, [current, images.length, goTo])

  const next = useCallback(() => {
    goTo(current === images.length - 1 ? 0 : current + 1)
  }, [current, images.length, goTo])

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next, images.length])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  if (images.length === 0) return (
    <div
      className="relative w-full flex flex-col items-center justify-center gap-3"
      style={{ aspectRatio: '16/9', background: 'rgba(22,20,18,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <svg className="w-10 h-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest opacity-25 text-white">
        {programName}
      </p>
    </div>
  )


  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', background: '#0d0c0b' }}>
      {/* Slides */}
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`${programName} - photo ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(13,12,11,0.6) 0%, transparent 40%)' }} />

      {/* Dot indicators only — no arrows, no counter */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300"
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === current ? '#ff571a' : 'rgba(255,255,255,0.35)',
              }}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
