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

  if (images.length === 0) return null

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

      {/* Controls — only show if multiple images */}
      {images.length > 1 && (
        <>
          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: 'rgba(13,12,11,0.7)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
            aria-label="Previous photo"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: 'rgba(13,12,11,0.7)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
            aria-label="Next photo"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all duration-300"
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  borderRadius: i === current ? '4px' : '50%',
                  background: i === current ? '#ff571a' : 'rgba(255,255,255,0.35)',
                }}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 z-20 px-2.5 py-1 text-xs font-bold text-white font-[family-name:var(--font-inter)]"
            style={{ background: 'rgba(13,12,11,0.65)', backdropFilter: 'blur(8px)' }}>
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}
