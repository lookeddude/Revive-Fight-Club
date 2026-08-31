'use client'

import { useRef, useState, useEffect } from 'react'

interface HomeVideoProps {
  videoUrl: string | null
}

/**
 * Homepage explainer video section.
 * MOBILE ONLY — hidden on md+ (tablet and desktop).
 * Full-screen portrait mode.
 * Auto-plays (muted) when scrolled into view, pauses when out of view.
 * Has a mute/unmute toggle button.
 */
export function HomeVideo({ videoUrl }: HomeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  if (!videoUrl) return null

  // Auto-play/pause on scroll using IntersectionObserver
  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay blocked — user needs to interact first
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 } // 50% visible triggers play
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  return (
    // block md:hidden → visible on mobile only
    <section className="block md:hidden relative" style={{ background: '#0E0C10' }}>
      <div ref={containerRef} className="relative w-full" style={{ aspectRatio: '9 / 16' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          muted
          playsInline
          loop
          preload="none"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Mute / Unmute button — bottom right */}
        <button
          onClick={toggleMute}
          className="absolute bottom-5 right-5 z-10 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 active:scale-90"
          style={{
            background: 'rgba(13,12,11,0.65)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            // Muted icon — speaker with X
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            // Unmuted icon — speaker with waves
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728" />
            </svg>
          )}
        </button>

        {/* Tap to unmute hint — shows briefly when muted and playing */}
        {isPlaying && isMuted && (
          <div
            className="absolute bottom-5 left-5 z-10 px-3 py-1.5 rounded-full animate-pulse"
            style={{
              background: 'rgba(13,12,11,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <p className="font-[family-name:var(--font-body)] text-[10px] text-white/70 tracking-wide uppercase">
              Tap 🔊 for sound
            </p>
          </div>
        )}

        {/* Subtle top + bottom gradient for polish */}
        <div
          className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,12,11,0.4), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(13,12,11,0.5), transparent)' }}
        />
      </div>
    </section>
  )
}
 
