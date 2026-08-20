'use client'

import { useRef, useState } from 'react'

interface HomeVideoProps {
  videoUrl: string | null
}

/**
 * Homepage explainer video section.
 * MOBILE ONLY — hidden on md+ (tablet and desktop).
 * 16:9 landscape aspect ratio.
 * Renders nothing if no video URL is set.
 */
export function HomeVideo({ videoUrl }: HomeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  if (!videoUrl) return null

  function handlePlay() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  function handleVideoEnd() {
    setIsPlaying(false)
  }

  return (
    // block md:hidden → visible on mobile, hidden on tablet + desktop
    <section className="block md:hidden" style={{ background: '#0d0c0b' }}>
      <div className="max-w-[1280px] mx-auto px-5 py-10">
        {/* Section label */}
        <p
          className="font-[family-name:var(--font-body)] text-xs font-black tracking-[0.18em] uppercase mb-4"
          style={{ color: '#f5a623' }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '24px',
              height: '1px',
              background: '#f5a623',
              marginRight: '10px',
              verticalAlign: 'middle',
            }}
          />
          About Revive Fight Club
        </p>

        {/* Video container — 16:9 */}
        <div
          className="relative w-full aspect-video overflow-hidden cursor-pointer"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          onClick={handlePlay}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            onEnded={handleVideoEnd}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />

          {/* Play button overlay — fades when playing */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{ background: 'rgba(13,12,11,0.45)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255,87,26,0.9)',
                boxShadow: '0 4px 20px rgba(255,87,26,0.4)',
              }}
            >
              <svg
                className="w-6 h-6 text-black ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Subtle bottom gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(13,12,11,0.6), transparent)',
            }}
          />
        </div>

        {/* Caption */}
        <p className="font-[family-name:var(--font-body)] text-xs text-[#6a6260] mt-3 text-center tracking-wide">
          Tap to play · Learn about our training programs and facility
        </p>
      </div>
    </section>
  )
}
 
