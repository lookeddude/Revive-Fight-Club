/**
 * Revive Fight Club — Motion Architecture
 * ========================================
 *
 * Animation stack responsibilities:
 *
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  Lenis           → smooth scrolling (global, one instance)   │
 *  │  Motion          → UI/component-level interactions           │
 *  │  CSS keyframes   → hero entrance, scroll reveals, stagger    │
 *  │  GSAP+ScrollTrig → advanced scroll timelines (phase 2)       │
 *  └──────────────────────────────────────────────────────────────┘
 *
 * Motion is used for interactions CSS cannot express:
 *  1. layoutId shared-element transitions (nav underline)
 *  2. AnimatePresence exit animations (dropdown unmount)
 *
 * Motion is NOT used to replace:
 *  - Lenis (scroll)
 *  - Reveal.tsx (IntersectionObserver scroll reveals)
 *  - CSS hover/active states already in Tailwind
 *  - Hero entrance (CSS hero-enter classes)
 *  - MobileNav slide (CSS transform transitions)
 *
 * ─────────────────────────────────────────────────────────────────
 * SHARED EASING
 * ─────────────────────────────────────────────────────────────────
 * expo-out: fast entry, controlled finish — athletic, confident.
 */

/** expo-out cubic-bezier — used for all entrance animations */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Fast UI feedback transition — dropdowns, tooltips */
export const TRANSITION_FAST = {
  duration: 0.15,
  ease: EASE_OUT,
} as const

/** Moderate transition — panels, overlays */
export const TRANSITION_MODERATE = {
  duration: 0.28,
  ease: EASE_OUT,
} as const

/** Spring — shared layout animations (nav underline) */
export const SPRING_SNAPPY = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 30,
} as const

/**
 * ─────────────────────────────────────────────────────────────────
 * VARIANTS
 * ─────────────────────────────────────────────────────────────────
 */

/** Auth dropdown in Header (AnimatePresence) */
export const dropdownVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: TRANSITION_FAST },
  exit:    { opacity: 0, y: -6, transition: TRANSITION_FAST },
} as const

/**
 * ─────────────────────────────────────────────────────────────────
 * REDUCED MOTION
 * Motion v13 respects prefers-reduced-motion automatically.
 * Layout and transform animations are disabled; opacity-only
 * transitions may still play. No additional handling required.
 *
 * FUTURE GSAP + ScrollTrigger integration:
 * ─────────────────────────────────────────
 * - GSAP handles: pinned hero, parallax layers, counters, timeline
 * - Sync Lenis + GSAP: lenis.on('scroll', ScrollTrigger.update)
 *   See: https://lenis.darkroom.engineering/docs/gsap
 * - Motion and GSAP coexist without shared state or RAF loops
 * ─────────────────────────────────────────────────────────────────
 */
