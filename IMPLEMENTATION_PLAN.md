# Revive Fight Club — Implementation Plan

> **Project:** Revive Fight Club Production Website
> **Stitch Project ID:** `11933130862683145963`
> **Phase 1 Created:** 2026-08-08
> **Status:** Phase 1 — COMPLETE

---

## Phase 1 — Discovery, Architecture, and Foundation

### 1.1 Stitch Design Access

- [x] Located Stitch project `11933130862683145963`
- [x] Verified project ownership and accessibility
- [x] Confirmed project title: "Revive Digital Identity System"
- [x] Confirmed design theme: "Kinetic High-Performance System"
- [x] Inspected all 13 screens across 5 design phases:
  - Homepage Foundation
  - Programs Overview
  - Program Detail (MMA as example)
  - Trainers Directory
  - Trainer Profile Detail
  - Schedule
  - Membership
  - About
  - Facilities and Gallery
  - Reviews and FAQ
  - Contact
  - Book a Trial (Desktop)
  - Book a Trial (Mobile)

### 1.2 Design Extraction

- [x] Extracted typography system (Outfit + Inter, full type scale)
- [x] Extracted complete color token system (Kinetic Orange, dark surfaces, ghost borders)
- [x] Extracted spacing system (8px base grid, named tokens)
- [x] Extracted layout system (1280px container, 12-col grid, breakpoints)
- [x] Extracted all component specifications:
  - Navigation header
  - Primary button / Secondary button / WhatsApp button
  - Trainer card (editorial layout)
  - Trainer detail hero
  - Program card
  - Membership cards
  - FAQ card
  - Form fields (underline style)
  - Gallery grid (bento/masonry) + lightbox
  - Stats/metric blocks
  - Footer (4-column)
  - Section accents and numbered lists
- [x] Extracted motion system (all transition specs)
- [x] Extracted image direction and treatment
- [x] Confirmed CTA hierarchy
- [x] Confirmed navigation structure
- [x] Confirmed responsive rules

### 1.3 Documentation Created

- [x] `DESIGN.md` — Complete design system reference
- [x] `IMPLEMENTATION_PLAN.md` — This document
- [x] `TECHNICAL_DECISIONS.md` — Architectural decisions record

### 1.4 Workspace Inspection

- [x] Workspace confirmed: Empty directory
- [x] No existing project to preserve or migrate
- [x] Safe to initialize new project

### 1.5 Environment Validation

- [x] Node.js: v24.18.0 (current LTS)
- [x] npm: 11.16.0
- [x] Git: 2.55.0 (Windows)
- [x] PowerShell execution policy: Restricted (npm must be run via `cmd` or node)
- [ ] Next.js project initialized (Phase 2)
- [ ] TypeScript configuration verified (Phase 2)
- [ ] ESLint configuration verified (Phase 2)
- [ ] Tailwind CSS v4 configured (Phase 2)

### 1.6 Architecture Defined

#### Framework: Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS v4
- ESLint + Prettier
- Supabase (environment-variable driven, no credentials in code)

#### Route Architecture

| Route | Page | Stitch Reference |
|-------|------|-----------------|
| `/` | Homepage | `cebcc010157e4f4e8b6a92b420481f3f` |
| `/programs` | Programs Overview | `99524c21c47745689eb716a86c35e6bb` |
| `/programs/[slug]` | Program Detail | `e3e3db926843469cb4d3f729054ec2e7` |
| `/trainers` | Trainers Directory | `3a740c6efceb45c98756aeebee8185e7` |
| `/trainers/[slug]` | Trainer Profile | `f30abc3549f84460be532ab4eae03d0a` |
| `/schedule` | Class Schedule | `f36164622cf945009846595c4ebffa31` |
| `/membership` | Membership Plans | `83757828fe21407c9fcdf73e581a0f9c` |
| `/about` | About the Club | `9b0c72b9e48b4448b525e6b86b94d7fc` |
| `/facilities` | Facilities and Gallery | `d7109882cc354e969b2b124ae8408360` |
| `/reviews` | Reviews and FAQ | `e0d233278a6b46a184e0659284db2fc5` |
| `/contact` | Contact | `1b516cb9be69472f9bbd7aa44d95657f` |
| `/book-trial` | Book a Trial Form | `1a4102a78b9847ff82779759e15be720` |
| `/book-trial/success` | Booking Success | (success state from form) |

#### Component Architecture (Planned)

```
components/
  layout/
    Header.tsx           — Fixed nav with logo, links, BOOK A TRIAL CTA
    Footer.tsx           — 4-col footer with links, social, copyright
    MobileNav.tsx        — Mobile hamburger menu drawer
  ui/
    Button.tsx           — Primary, Secondary, Ghost, WhatsApp variants
    Badge.tsx            — Uppercase tag/label (kinetic orange or white)
    Tag.tsx              — Discipline tag (ghost border, label-sm)
    SectionHeading.tsx   — Left-border accent heading block
    GhostBorder.tsx      — Reusable ghost-border wrapper
  cards/
    TrainerCard.tsx      — Editorial layout trainer card
    ProgramCard.tsx      — Dark full-bleed program card
    MembershipCard.tsx   — Membership tier card
    FAQCard.tsx          — FAQ question/answer card
    StatCard.tsx         — Metric/stat block
    ReviewCard.tsx       — Review/testimonial card
  sections/
    Hero.tsx             — Full-viewport hero with overlay
    ProgramsGrid.tsx     — Program cards grid
    TrainersGrid.tsx     — Trainer editorial grid
    ScheduleTable.tsx    — Class schedule grid
    GalleryGrid.tsx      — Bento gallery with lightbox
    CTASection.tsx       — Standalone CTA block
    MembershipSection.tsx — Membership bento grid
    FAQSection.tsx       — FAQ accordion/card grid
    ReviewsSection.tsx   — Reviews grid/carousel
    ContactForm.tsx      — Contact form
    FacilitiesSection.tsx — Facility narrative with images
  forms/
    TrialBookingForm.tsx — Book a trial multi-field form
    FormField.tsx        — Underline-style input wrapper
    FormSelect.tsx       — Styled select with underline
  lightbox/
    Lightbox.tsx         — Gallery lightbox overlay
  seo/
    LocalBusinessSchema.tsx — JSON-LD structured data
    PageMeta.tsx         — Per-page meta/OG wrapper
```

#### Data Layer Architecture (Planned)

```
lib/
  supabase/
    client.ts            — Browser-side Supabase client
    server.ts            — Server-side Supabase client
  data/
    programs.ts          — Program data access functions
    trainers.ts          — Trainer data access functions
    schedule.ts          — Schedule data access functions
    membership.ts        — Membership plan data
    reviews.ts           — Reviews data
    gallery.ts           — Gallery items data
    bookings.ts          — Booking submission (Phase 4+)
  utils/
    formatters.ts        — Date, time, price formatting
    validators.ts        — Form validation utilities
    cn.ts                — className utility (clsx + twMerge)
```

#### Types Architecture (Planned)

```
types/
  index.ts              — Re-exports all types
  program.ts            — Program, ProgramLevel, ProgramSlug
  trainer.ts            — Trainer, TrainerCredential, TrainerStat
  schedule.ts           — ScheduleItem, ClassTime, DaySchedule
  membership.ts         — MembershipPlan, MembershipFeature
  review.ts             — Review, ReviewRating
  gallery.ts            — GalleryItem, GalleryCategory
  booking.ts            — BookingRequest, BookingStatus
  business.ts           — BusinessInfo, ContactDetails, OpeningHours
  faq.ts                — FAQItem, FAQCategory
  navigation.ts         — NavItem, NavGroup
```

### 1.7 Supabase Strategy Defined

- [ ] No database tables created yet (Phase 4+)
- [ ] Environment variable architecture prepared (Phase 2)
- [ ] Client-side and server-side split prepared
- [ ] Service role key NEVER exposed to browser

### 1.8 SEO Strategy Defined

- Metadata per page via Next.js `generateMetadata`
- Local business JSON-LD structured data component
- Open Graph and Twitter Card metadata
- Canonical URLs
- Semantic HTML throughout (h1, h2, nav, main, article, section, footer)
- Image alt text required on every image
- Site name: "Revive Fight Club" | Location: Frazer Town, Bengaluru

### 1.9 Image Strategy Defined

- Real Revive photography: NOT yet available — placeholder system required
- Phase 1-2: AI-generated placeholder images OR CSS gradient placeholders with correct aspect ratios
- Phase 3+: Replace with real business photography
- All images use Next.js `<Image>` component for optimization
- Defined aspect ratios per image type (see DESIGN.md Image Direction section)
- Alt text policy: Descriptive, not keyword-stuffed

### 1.10 Environment Security Prepared

- `.gitignore` created to exclude `.env`, `.env.local`, `.env.*.local`
- No credentials will be hard-coded in source
- Environment variable names defined but values left empty until Supabase project is created
- Public keys prefixed `NEXT_PUBLIC_` — only truly public keys get this prefix

---

## Phase 2 — Foundation Build

> DO NOT START until "ANTIGRAVITY PHASE 2" is explicitly issued.

**Scope:**

- Initialize Next.js 15 project with TypeScript strict mode
- Configure Tailwind CSS v4 with full Stitch design token system
  - All color tokens from DESIGN.md mapped to CSS custom properties
  - All typography tokens (font sizes, weights, line heights, letter spacing)
  - All spacing tokens
  - Custom Tailwind plugins for ghost-border, kinetic-orange utilities
- Set up Google Fonts (Outfit + Inter) via Next.js font optimization
- Create `.env.local.example` template with Supabase variable names
- Create `.gitignore` with full Next.js + Supabase coverage
- Set up ESLint + Prettier configuration
- Build all shared UI components:
  - Button (all variants)
  - Badge / Tag
  - FormField / FormSelect
  - SectionHeading
  - GhostBorder wrapper
- Build Header component (desktop + mobile with hamburger)
- Build Footer component (4-column)
- Verify `npm run dev` starts without errors
- Verify TypeScript compilation clean
- Verify ESLint passes

**Verification:** Running dev server, TypeScript clean, zero lint errors

---

## Phase 3 — Page Implementation (Homepage + Core Pages)

> DO NOT START until "ANTIGRAVITY PHASE 3" is explicitly issued.

**Scope:**

- Homepage (`/`) — All sections pixel-perfect to Stitch
  - Hero (full-viewport, headline, subtext, dual CTA)
  - Programs teaser section
  - Trainers teaser section
  - Stats/Trust bar
  - Google reviews snippet
  - Final CTA section
- Programs page (`/programs`)
- Program Detail page (`/programs/[slug]`)
- Trainers page (`/trainers`)
- Trainer Profile page (`/trainers/[slug]`)
- Schedule page (`/schedule`)
- Responsive implementation: mobile-first for all pages
- SEO metadata for all pages

**Verification:** Visual comparison against Stitch screenshots, responsive at 375px / 768px / 1280px

---

## Phase 4 — Remaining Pages + Supabase Integration

> DO NOT START until "ANTIGRAVITY PHASE 4" is explicitly issued.

**Scope:**

- Membership page (`/membership`)
- About page (`/about`)
- Facilities and Gallery page (`/facilities`)
- Reviews and FAQ page (`/reviews`)
- Contact page (`/contact`)
- Book a Trial page (`/book-trial`) — static form only (no backend yet)
- Supabase project creation and initial schema
  - Programs table
  - Trainers table
  - Schedule table
  - Membership plans table
  - Reviews table
  - Gallery table
- Data access layer implementation
- Replace static data with Supabase queries (programs, trainers, schedule)
- Booking form submission to Supabase
- Environment variables fully configured

**Verification:** All pages render, Supabase data flows, booking form submits

---

## Phase 5 — Booking System + Admin Foundation

> DO NOT START until "ANTIGRAVITY PHASE 5" is explicitly issued.

**Scope:**

- Booking request workflow
  - Trial booking form (complete with validation)
  - Booking success and error states
  - Supabase booking_requests table
  - Email notification via Supabase Edge Function or external service
  - WhatsApp integration
- Admin authentication (Supabase Auth)
- Admin dashboard foundation
  - View booking requests
  - Manage programs
  - Manage trainers
  - Manage schedule
- Protected admin routes (`/admin/*`)

**Verification:** End-to-end booking flow, admin login, data management

---

## Phase 6 — Production Readiness

> DO NOT START until "ANTIGRAVITY PHASE 6" is explicitly issued.

**Scope:**

- Real photography integration (replace all placeholders)
- Real business data population (confirm all contact details, hours, pricing)
- Performance optimization
  - Image optimization via Next.js Image
  - Code splitting review
  - Lighthouse score targets: Performance 90+, Accessibility 95+, SEO 100
- SEO finalization
  - Structured data testing
  - Sitemap generation
  - robots.txt
  - Meta tags audit
- Accessibility audit (keyboard navigation, ARIA, contrast ratios)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile testing (iOS Safari, Android Chrome)
- Security audit
  - No exposed secrets
  - Rate limiting on booking form
  - Input sanitization
- Domain configuration
- Deployment pipeline (Vercel recommended)
- Go-live

**Verification:** Production deployment, all flows tested, Lighthouse audit passed

---

## Open Questions — Require Client Input

> These items need real business information before Phase 3/4.

| # | Question | Required For |
|---|----------|-------------|
| 1 | Exact physical address (street-level for Google Maps) | Contact, SEO, Structured Data |
| 2 | Real phone number | Header, Contact, Footer |
| 3 | Real email address | Contact form, booking |
| 4 | Operating hours (all days, not just Mon-Sat) | Footer, Structured Data |
| 5 | Social media handles (Instagram, Facebook, YouTube URLs) | Footer, Gallery |
| 6 | WhatsApp number for CTA | Book Trial, Membership CTAs |
| 7 | Actual programs offered (name, description, duration, level) | Programs, Schedule |
| 8 | Real trainer names, bios, credentials, photos | Trainers |
| 9 | Real membership pricing (or confirm "contact for price" approach) | Membership |
| 10 | Supabase project creation (or existing project details) | Phase 4 Supabase |
| 11 | Custom domain name | Phase 6 deployment |
| 12 | Google Analytics / GTM tracking codes | Phase 6 |
| 13 | Real photography / video assets | Phase 3+ |
| 14 | Google Business Profile ID for reviews embed | Reviews page |
