# Revive Fight Club — Technical Decisions Record

> This document records key architectural decisions and the reasoning behind them.
> Created: Phase 1 — Discovery and Architecture
> Date: 2026-08-08

---

## ADR-001: Framework — Next.js 15 (App Router)

**Decision:** Use Next.js 15 with the App Router.

**Rationale:**
- Server Components reduce JavaScript bundle size on the client — critical for performance on mobile
- App Router enables per-route metadata via `generateMetadata()` — required for proper local business SEO
- Built-in image optimization (`next/image`) with lazy loading and modern formats (WebP/AVIF) — essential for a photography-heavy site
- File-system routing maps cleanly to the Stitch route architecture (`/programs/[slug]`, `/trainers/[slug]`)
- Vercel deployment is zero-config for Next.js — optimal for eventual production deployment
- Strong TypeScript integration from the start
- React Server Components allow clean data-fetching directly in components without additional API routes for read-only operations
- Next.js `next/font` provides zero-layout-shift Google Font loading — important since Outfit and Inter are critical to the design

**Alternatives Considered:**
- Vite + React (SPA): No SSR, poor SEO without additional configuration. Rejected.
- Remix: Good option but smaller ecosystem. Next.js better fits the team and Supabase integration patterns.
- Astro: Excellent for static sites but dynamic booking and admin functionality requires more configuration. Next.js provides cleaner integrated solution.

---

## ADR-002: Language — TypeScript (Strict Mode)

**Decision:** TypeScript with `strict: true` in tsconfig.

**Rationale:**
- The application will grow across 6+ phases and involve multiple data types (Program, Trainer, Booking, etc.)
- Strict TypeScript catches data shape mismatches between Supabase responses and UI components at compile time
- `generateStaticParams()` and `generateMetadata()` in Next.js have typed signatures that strict TypeScript enforces correctly
- Supabase provides generated TypeScript types from the database schema — strict mode takes full advantage of this
- Refactoring across phases is significantly safer with full type coverage

**Rules:**
- No `any` without explicit, documented justification
- All Supabase query results typed against generated schema types
- All component props fully typed with interfaces or types
- Use `unknown` over `any` when type is genuinely unknown

---

## ADR-003: Styling — Tailwind CSS v4

**Decision:** Tailwind CSS v4 as the primary styling system.

**Rationale:**
- The Stitch design was built and exported with Tailwind CSS (confirmed from inspecting all 13 HTML files — every screen uses `tailwind.config` with identical token definitions)
- Tailwind v4 uses CSS custom properties natively, enabling the design token system to map directly to CSS variables
- The Stitch token system (colors, spacing, typography) maps perfectly to Tailwind's `theme.extend` structure
- Tailwind's responsive prefix system (`md:`, `lg:`) directly matches the Stitch breakpoints observed in every screen
- Utilities like `ghost-border` will be implemented as custom Tailwind utilities or CSS classes
- Avoids the "CSS Module + design token" synchronization problem — tokens are in one place

**Token Mapping Strategy:**
- All Stitch named colors become Tailwind color tokens in `tailwind.config`
- All Stitch spacing tokens become custom spacing values
- All Stitch font sizes/weights become custom `fontSize` entries with full options objects
- `ghost-border` helper class defined as a base layer CSS class: `border: 1px solid rgba(245, 245, 243, 0.1)`
- `kinetic-orange` and related helpers added as base layer utilities

**Alternatives Considered:**
- CSS Modules: More verbose, requires manual token synchronization with DESIGN.md. Rejected.
- Vanilla CSS + CSS Custom Properties: Viable but Tailwind already handles this better with the design token structure Stitch uses. Rejected.
- Styled Components: Runtime CSS-in-JS adds overhead with React Server Components. Rejected.

---

## ADR-004: Database — Supabase

**Decision:** Supabase as the backend-as-a-service platform.

**Rationale:**
- Provides PostgreSQL with full relational capabilities (programs → schedule items, trainers → certifications)
- Real-time subscriptions for future live schedule updates
- Built-in Row Level Security (RLS) for admin vs. public access separation
- Supabase Auth for future admin authentication (Phase 5)
- Supabase Edge Functions for booking notifications (email/WhatsApp) — server-side, no cold start penalty at function level
- `supabase-js` v2 has excellent TypeScript support and integrates cleanly with Next.js App Router via server-side client
- Managed service — no infrastructure to maintain
- Free tier sufficient for Phase 1-3 development

**Client Architecture:**
- `lib/supabase/client.ts` — Browser client using `createBrowserClient()` (from `@supabase/ssr`)
- `lib/supabase/server.ts` — Server client using `createServerClient()` with cookie handling
- Service role key: NEVER used in browser-facing code — only in Edge Functions or trusted server contexts
- Public anon key: Used for read-only public data (programs, trainers, schedule, gallery, reviews)

**Phase Strategy:**
- Phase 1: Architecture only — no tables created, no credentials needed
- Phase 2: Project foundation — env variable names defined, clients stubbed
- Phase 4: Database schema created, data access layer built

---

## ADR-005: Design Token Representation

**Decision:** Design tokens represented as Tailwind config extensions, mirroring Stitch's output exactly.

**Rationale:**
- Stitch already exports the Tailwind config that encodes all design tokens. The implementation should match this exactly to guarantee fidelity.
- Token names (e.g., `primary-container`, `on-surface`, `surface-container-high`) map directly from Stitch to Tailwind to component code
- CSS custom properties generated by Tailwind v4 serve as the single source of truth at runtime
- This eliminates a "translation layer" where tokens get renamed and drift from design

**Token naming convention:** Follow Stitch exactly — e.g., `bg-primary-container`, `text-on-surface`, `border-white/10`

---

## ADR-006: Component Organization

**Decision:** Components organized by layer (layout, ui, cards, sections, forms) not by page.

**Rationale:**
- Stitch confirms that most components appear across multiple pages (Header, Footer, Button, Badge)
- Organizing by page would lead to duplication and inconsistency
- Layer-based organization keeps components reusable and avoids the "ComponentForPage" anti-pattern
- `sections/` components are page-section level (Hero, CTASection) — they accept data props and render the designed layout
- `ui/` components are atomic (Button, Badge, Tag) — pure presentation
- `cards/` sit between sections and atoms — compound components with defined Stitch variants
- `layout/` is exclusively Header + Footer + mobile nav — shared shell

---

## ADR-007: Database Access Separation

**Decision:** All database access goes through `lib/data/` — never directly inside component files.

**Rationale:**
- UI components should receive typed data as props — they should not know about Supabase
- This enables the UI to be built and tested with static data in Phase 2-3 before Supabase is ready in Phase 4
- When data sources change (e.g., adding a CMS later), only `lib/data/` files change — not component files
- Server Components can call `lib/data/` functions directly — the function, not the component, is responsible for the Supabase client
- This pattern also allows switching between static data (development) and live data (production) via a single environment flag

**Pattern:**

```typescript
// lib/data/programs.ts
import { createServerClient } from '@/lib/supabase/server'

export async function getPrograms(): Promise<Program[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from('programs').select('*')
  if (error) throw error
  return data
}

// app/programs/page.tsx
import { getPrograms } from '@/lib/data/programs'

export default async function ProgramsPage() {
  const programs = await getPrograms()
  return <ProgramsGrid programs={programs} />
}
```

---

## ADR-008: Environment Variable Strategy

**Decision:** Strict separation between public and private environment variables.

**Public (client-accessible, prefixed NEXT_PUBLIC_):**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anonymous key (safe to expose)

**Private (server-only, NO NEXT_PUBLIC_ prefix):**
- `SUPABASE_SERVICE_ROLE_KEY` — NEVER exposed to browser
- Any external API keys (email service, SMS, etc.)
- Any webhook secrets

**Files:**
- `.env.local` — Real values, NEVER committed to Git
- `.env.local.example` — Template with empty values, COMMITTED to Git as documentation
- `.gitignore` — Excludes all `.env*.local` files

**Rule:** Any file that accesses `SUPABASE_SERVICE_ROLE_KEY` must be a Server Component, Route Handler, Server Action, or Edge Function. This is enforced at the architectural level, not just policy.

---

## ADR-009: SEO Architecture

**Decision:** Use Next.js `generateMetadata()` per route with a shared base metadata config.

**Structure:**
- `app/layout.tsx` — Base metadata (site name, default OG image, Twitter card defaults)
- Each `app/[route]/page.tsx` — Specific title, description, canonical URL via `generateMetadata()`
- `components/seo/LocalBusinessSchema.tsx` — JSON-LD component for local business structured data
- Placed in `app/layout.tsx` for global coverage, overridable per page

**Local Business SEO:**
- Schema type: `LocalBusiness` (subtype `SportsActivityLocation` or `HealthClub`)
- Required fields: name, address, telephone, openingHours, priceRange, geo coordinates
- Google Reviews: Will be embedded via Google Places API or displayed statically (Phase 4)

**Rule:** No fabricated ratings, addresses, or review counts will be included until real data is confirmed.

---

## ADR-010: Image Strategy

**Decision:** Next.js `next/image` for all images, with a defined placeholder system.

**Placeholder System (Phase 1-3):**
- CSS gradient placeholders that maintain correct aspect ratios (no distorted layout)
- Placeholder classes using the design system's surface colors
- Aspect ratios defined per image type in DESIGN.md:
  - Hero: full-viewport-height
  - Trainer cards: h-[600px]
  - Program cards: h-80 (320px)
  - Gallery: auto-rows-[250px]
- Alt text REQUIRED on every placeholder — descriptive, not decorative

**Production Image Strategy (Phase 3+):**
- Store real photography in Supabase Storage or a CDN
- Reference URLs via environment variables or database
- `next/image` handles optimization, lazy loading, srcset generation

**Rule:** No stock photography will be permanently embedded in the codebase. All image references must be clearly identifiable as placeholders.

---

## ADR-011: Admin Architecture (Future — Phase 5)

**Decision:** Admin functionality will live under `/admin/*` protected routes.

**Rationale:**
- Clean separation from public website — admin and public share components but not pages
- Supabase Auth manages session, server middleware validates admin access
- Row Level Security on Supabase tables provides database-level authorization
- Admin UI will be purpose-built for the business needs — NOT a generic CMS template
- Phase 1 foundation makes no assumptions about admin UI framework to avoid premature decisions

---

## ADR-012: Git Strategy

**Decision:** Git initialized in the project root. No deployment until Phase 6.

**Branching (when team grows):**
- `main` — Production-ready code only
- `develop` — Integration branch
- `feature/[name]` — Feature branches

**For Phase 1-3 (solo development):**
- Commits on `main` with clear phase-based commit messages
- No force pushes to `main`

**Secrets Policy:**
- `.gitignore` excludes all `.env*.local` files before first commit
- Pre-commit check recommended (Phase 6) to prevent accidental secret commits

---

## Key Technical Constraints

| Constraint | Impact |
|-----------|--------|
| PowerShell execution policy is Restricted | Use `cmd` shell for npm commands, or set execution policy |
| Node.js v24.18.0 | Must use Next.js 15 (compatible with Node 18+) |
| npm 11.16.0 | Standard npm workflows apply |
| Workspace is empty | Clean initialization — no migration needed |
| Stitch uses Tailwind CSS | Design token system maps directly to Tailwind config |
| Design is dark-mode only | No light mode implementation needed; `class="dark"` on html element |
| All border-radius: 0 | Tailwind `rounded-*` classes should be avoided except where documented |
| 8px grid strict | All spacing must use defined tokens |
