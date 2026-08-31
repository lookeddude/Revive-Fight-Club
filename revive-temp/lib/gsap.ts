/**
 * Revive Fight Club — GSAP Foundation
 * =====================================
 *
 * Single entry point for all GSAP usage across the project.
 * Registers plugins once. Import pattern:
 *
 *   import { gsap, ScrollTrigger } from '@/lib/gsap'
 *
 * Animation stack responsibilities:
 *   Lenis       → smooth scrolling         (LenisProvider.tsx)
 *   GSAP/ST     → reveals, counters,       (THIS — components/gsap/)
 *                 hero entrance, parallax
 *   CSS         → nav, dropdown, mobile,   (Header, MobileNav, MembershipHero)
 *                 membership entrance      (no JS animation library needed)
 *   CSS Reveal  → home section reveals     (Reveal.tsx + globals.css)
 */

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register plugins — safe to call multiple times, GSAP deduplicates
gsap.registerPlugin(ScrollTrigger)

// Defaults — matches RFC brand: fast start, controlled finish
gsap.defaults({
  ease: 'power3.out',
  duration: 0.65,
})

// ScrollTrigger defaults — one-way (play on enter, no reverse)
ScrollTrigger.defaults({
  toggleActions: 'play none none none',
})

export { gsap, ScrollTrigger }
