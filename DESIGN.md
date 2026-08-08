# Revive Fight Club — Design System

> **Source of Truth:** Google Stitch Project `11933130862683145963`
> **Project Title:** Revive Digital Identity System
> **Stitch Theme:** Kinetic High-Performance System
> **Color Mode:** Dark
> **Last Inspected:** 2026-08-08

---

## Design Source

- **Stitch Project ID:** `11933130862683145963`
- **Project Type:** TEXT_TO_UI_PRO (Premium design quality)
- **Device Type:** Desktop (with mobile screens included)
- **Screens Inspected:** 13 screens across 5 design phases

---

## Brand Direction

The design system is codified under the name **"Kinetic Minimalism"**.

This is a dark-mode-centric, editorial design system built for a premium combat sports brand. It deliberately rejects the "gritty" clichés of traditional fight branding in favor of a **cinematic, surgically precise, high-contrast aesthetic** drawn from high-end fashion and sports journalism.

### Core Pillars

1. **Cinematic Photography** — Large-scale, high-contrast imagery is the primary atmospheric driver
2. **Precision Alignment** — Strict 12-column grid system; reflects technical accuracy of the sport
3. **High-Impact Contrast** — Dark foundation with "Kinetic Orange" as the exclusive action signal
4. **Typographic Architecture** — Typography used as a structural, editorial element

### Tone and Voice

- Raw intensity meets surgical precision
- Premium, not gritty
- Disciplined, not aggressive
- Technical mastery over enthusiasm
- Elite performance, not mass-market fitness

---

## Typography

### Font Families

| Role | Family | Google Font Import |
|------|---------|-------------------|
| Display / Headings | **Outfit** | `family=Outfit:wght@600;700;800` |
| Body / Labels | **Inter** | `family=Inter:wght@400;500;700` |
| Icons | Material Symbols Outlined | Google Material Symbols |

### Type Scale (Extracted from Stitch)

| Token | Family | Size | Weight | Line Height | Letter Spacing |
|-------|---------|------|--------|-------------|----------------|
| `display-lg` | Outfit | 80px | 800 | 88px | -0.04em |
| `headline-xl` | Outfit | 48px | 700 | 56px | -0.02em |
| `headline-xl-mobile` | Outfit | 36px | 700 | 40px | -0.02em |
| `headline-md` | Outfit | 24px | 600 | 32px | -0.01em |
| `body-lg` | Inter | 18px | 400 | 28px | — |
| `body-md` | Inter | 16px | 400 | 24px | — |
| `label-bold` | Inter | 14px | 700 | 20px | 0.1em |
| `label-sm` | Inter | 12px | 500 | 16px | — |

### Typography Rules

- **Display text** (`display-lg`): Hero sections only; often overlapping imagery
- **Uppercase labels**: All small labels use `label-bold` with `text-transform: uppercase` and `letter-spacing: 0.1em`
- **Heading hierarchy**: Strict distinction between `Outfit` (expressive) and `Inter` (functional)
- **Active nav links**: Underlined with primary color bottom border

---

## Color Tokens

All colors extracted directly from Stitch's "Kinetic High-Performance System" design theme.

### Primary Color Reference

| Name | Hex | Role |
|------|-----|------|
| Kinetic Orange | `#ff571a` | Primary CTA, badges, active states |
| Soft Orange | `#ffb59e` | Active nav links, tags, soft accents |
| Deep Black | `#0d0f0e` | Footer, absolute darkest |
| Dark Ground | `#121413` | Page background |
| Warm Off-white | `#e2e3e1` | Primary text |

### Full Semantic Token Map

| Semantic Name | Stitch Token | Hex Value | Usage |
|--------------|--------------|-----------|-------|
| `background` | `background` | `#121413` | Primary page background |
| `background-deepest` | `surface-container-lowest` | `#0d0f0e` | Footer, absolute darkest surfaces |
| `surface` | `surface` | `#121413` | Card and component surface |
| `surface-low` | `surface-container-low` | `#1a1c1b` | Subtle surface elevation |
| `surface-mid` | `surface-container` | `#1e201f` | Modal backgrounds, elevated cards |
| `surface-high` | `surface-container-high` | `#282a29` | Elevated cards, selected states |
| `surface-highest` | `surface-container-highest` | `#333534` | Badges, chips, highest elevation |
| `surface-bright` | `surface-bright` | `#383a38` | Hover backgrounds |
| `foreground` | `on-surface` | `#e2e3e1` | Primary text (warm off-white) |
| `foreground-muted` | `on-secondary-container` | `#bab8b7` | Secondary text |
| `foreground-tertiary` | `on-tertiary-container` | `#2a2a29` | Dimmed text, footer links |
| `accent` | `primary-container` | `#ff571a` | **Kinetic Orange** — CTAs, badges, active states |
| `accent-soft` | `primary` | `#ffb59e` | Soft orange — active nav, tags, icons |
| `on-accent` | `on-primary` | `#5e1700` | Text on primary buttons (effectively black) |
| `border-subtle` | (custom) | `rgba(245,245,243,0.1)` | Ghost borders (1px transparent) |
| `border` | `outline` | `#ad897e` | Standard visible borders |
| `border-accent` | `outline-variant` | `#5c4037` | Active/focus borders |
| `secondary` | `secondary` | `#c9c6c5` | Secondary elements, tertiary text |
| `secondary-container` | `secondary-container` | `#4a4949` | Secondary container backgrounds |
| `tertiary` | `tertiary` | `#c8c6c5` | Metadata, technical labels |
| `error` | `error` | `#ffb4ab` | Error state text |
| `error-container` | `error-container` | `#93000a` | Error background |
| `on-error-container` | `on-error-container` | `#ffdad6` | Error container text |
| `inverse-surface` | `inverse-surface` | `#e2e3e1` | Light mode inversion (tooltip BG) |
| `inverse-primary` | `inverse-primary` | `#ae3200` | Inverse primary for contrast |
| `on-surface-variant` | `on-surface-variant` | `#e6beb2` | Warm-tinted secondary text |

### Critical Color Rules

1. **`#ff571a` (Kinetic Orange)** is the ONLY color used for primary CTAs, active states, performance metrics
2. **Ghost borders** use `rgba(245, 245, 243, 0.1)` — not solid dark borders
3. **No drop shadows** — elevation is achieved through tonal value shifts (Tonal Layering)
4. **Active nav state** = text color `#ffb59e` + 1px bottom border `#ffb59e`
5. **Hover state for primary button** = background shifts to white, text stays black
6. **Text selection** = `selection:bg-primary-container selection:text-background`

---

## Spacing System

Based on an **8px base grid**. All spacing MUST be multiples of 8px.

| Token | Value | Usage |
|-------|-------|-------|
| `base` | 8px | Atomic unit — padding, border spacers |
| `stack-sm` | 12px | Tight vertical gap between inline elements |
| `stack-md` | 24px | Standard component gap |
| `stack-lg` | 48px | Section-level spacing |
| `gutter` | 24px | Column gutter in grid |
| `margin-mobile` | 20px | Page edge on mobile |
| `margin-desktop` | 64px | Page edge on desktop |

---

## Layout

### Container

| Property | Value |
|----------|-------|
| Max content width | `1280px` |
| Desktop page margin | `64px` each side |
| Mobile page margin | `20px` each side |
| Column gutter | `24px` |

### Grid System

- **Desktop:** 12-column fixed grid (`grid-cols-12`)
- **Mobile:** Collapses to single column (`grid-cols-1`)
- **Asymmetric editorial layouts** are standard: e.g., `col-span-7` image + `col-span-5` content
- Common column splits: 7+5, 5+7, 8+4, 4+8, 3-equal columns

### Breakpoints

| Breakpoint | Width | Tailwind Prefix | Behavior |
|-----------|-------|-----------------|---------|
| Mobile | < 768px | (default) | Single column, reduced margins |
| Tablet/Desktop | >= 768px | `md:` | 12-column grid, full margins |
| Wide | >= 1280px | container max | 1280px enforced |

### Section Spacing Pattern

- Hero sections: `h-[80vh]` or `min-h-[921px]` with full-bleed imagery
- Content sections: `py-24` (96px) or `py-stack-lg` (48px) vertical padding
- "Power of the void": Large vertical gaps between sections are intentional — creates editorial, premium feel

---

## Components

### Navigation Header

```
Height:         80px (h-20)
Background:     #121413 (background), same dark/light
Border-bottom:  1px solid rgba(255,255,255,0.1)
Position:       fixed top-0 w-full z-50
Logo text:      "REVIVE FIGHT CLUB"
Logo font:      Outfit, headline-md (24px), font-bold, tracking-tighter
Nav links:      Inter, label-bold (14px), uppercase, letter-spacing 0.1em
Link colors:    on-surface (#e2e3e1) default
Link hover:     color → #ffb59e, transition-colors 200ms
Active link:    text-primary (#ffb59e) + border-b border-primary pb-1
CTA button:     "BOOK A TRIAL" — primary button style (always visible on desktop)
Mobile:         Shows material-symbols menu icon, hides all nav links
Mobile CTA:     Hidden or simplified
```

### Primary Button

```
Background:     #ff571a (Kinetic Orange)
Text color:     black (#000000)
Font:           Inter, label-bold, 14px, weight 700
Text transform: uppercase
Letter-spacing: 0.1em
Padding:        32px horizontal (px-8), 16px vertical (py-4)
Border-radius:  0px — SHARP EDGES, NO ROUNDING
Hover:          background → white (#ffffff)
Active state:   scale(0.95) transform
Transition:     all 300ms
```

### Secondary / Ghost Button

```
Background:     transparent or surface-container (#1e201f)
Border:         1px solid rgba(245,245,243,0.1)
Text color:     on-surface (#e2e3e1)
Font:           Inter, label-bold, uppercase
Padding:        px-8 py-4
Border-radius:  0px
Hover:          background → surface-bright (#383a38)
```

### WhatsApp Button

```
Background:     surface-container (#1e201f)
Text color:     on-surface (#e2e3e1)
Icon:           Material Symbols "chat" outlined
Padding:        px-8 py-4
Border-radius:  0px
Hover:          surface-container-high (#282a29)
```

### Trainer Card — Directory (Editorial)

```
Container:      grid grid-cols-12, ghost-border (1px rgba(245,245,243,0.1)), p-base
Image col:      col-span-7, h-[600px], overflow-hidden
Image:          w-full h-full object-cover
Image filter:   grayscale at rest → grayscale-0 on hover
Image scale:    group-hover:scale-105, transition 500ms
Gradient:       absolute inset, bg-gradient-to-t from-background to-transparent, opacity-80
Content col:    col-span-5, flex flex-col justify-end p-stack-md
Specialty:      label-bold, primary-container (#ff571a), uppercase
Name (h2):      headline-xl, on-surface, font-bold
Bio:            body-md, on-secondary-container (#bab8b7)
Discipline tags: ghost-border, px-3 py-1, label-sm, on-surface
Alternating:    Trainer 2 reverses layout (content left, image right)
```

### Trainer Detail Page — Hero

```
Min-height:     min-h-[921px]
Image treatment: mix-blend-luminosity, opacity-80
Gradients:      top-to-bottom + left-to-right dual gradient (corner fade)
Content:        absolute z-20, bottom-positioned, col-span-8
Role label:     label-bold, primary, uppercase, tracking-widest
Name:           display-lg, Outfit, leading-none
Stroke text:    -webkit-text-stroke: 2px on nickname (outline text effect)
Stats sidebar:  col-span-4, border-l border-primary-container
```

### Program Card

```
Height:         h-80 (320px)
Position:       relative, overflow-hidden
Image:          absolute inset, bg-cover bg-center
Image blend:    mix-blend-luminosity, opacity-40 → opacity-60 on hover
Image scale:    group-hover:scale-105, transition 700ms
Overlay:        bg-gradient-to-t from-background via-background/50 to-transparent
Badge:          bg-primary-container, text-black, label-bold, uppercase, px-3 py-1, NO radius
Title:          headline-md, on-surface
Meta row:       label-sm, schedule + group icons, on-surface/60
```

### Membership Cards

```
Standard card:
  Background:   #121212 (card-surface)
  Border:       1px solid rgba(245,245,243,0.1)
  Hover border: #ff571a + box-shadow rgba(255,87,26,0.1)
  Padding:      p-8 (32px)
  Transition:   all 300ms

Annual featured card:
  Grid:         col-span-8 (wider)
  Background:   surface-container-high (#282a29)
  Has atmospheric bg image: opacity-20, mix-blend-overlay, hover:scale-105
  Badge:        "ULTIMATE VALUE" — primary-container, label-bold, uppercase

Price display:  headline-xl or headline-md, text-primary-container
CTA:            Full primary button (w-full or w-auto)
Features list:  Material Symbols check icon + body-md text
```

### FAQ Item

```
Background:     #121212 / surface
Border:         1px solid rgba(245,245,243,0.1)
Padding:        p-6 (24px)
Question:       label-bold, primary-container, uppercase, Material icon prefix
Answer:         body-md, on-surface-variant
Grid:           2-column on desktop
```

### Form Fields

```
Input style:    Underline only (no full border box)
Background:     transparent
Border-bottom:  1px solid rgba(245,245,243,0.1)
Focus state:    border-bottom-color → primary-container (#ff571a), 0.3s transition
Text color:     on-surface (#e2e3e1)
Label:          label-bold, uppercase, mb-2, text-on-surface
Font:           body-md (Inter, 16px)
Select:         appearance-none, bg-transparent, same underline style
Textarea:       resize-none, 3 rows
Date input:     color-scheme: dark
Grid:           2-column for name/phone, email/discipline; full-width for message
```

### Gallery Grid (Bento/Masonry)

```
Grid:           grid-cols-12, auto-rows-[250px]
Feature item:   col-span-8, row-span-2 (large — action shot)
Supporting:     col-span-4, row-span-1
Border:         ghost-border (1px rgba(245,245,243,0.1))
Image scale:    hover:scale-105, cubic-bezier(0.25,1,0.5,1), 500ms
Hover overlay:  opacity-0 → opacity-100, flex items-center justify-center
Expand icon:    Material Symbols "fullscreen" or "zoom_in"
Click:          Opens lightbox
View toggle:    Grid view / Agenda view buttons (Material Symbols)
```

### Lightbox

```
Position:       fixed inset-0 z-[100]
Background:     bg-background/95 backdrop-blur-sm
Transition:     opacity 0.3s ease
Close button:   absolute top-8 right-8, Material Symbols "close"
Image container: max-w-5xl, h-[80vh], ghost-border
Esc key:        closes lightbox
```

### Footer

```
Background:     surface-container-lowest (#0d0f0e)
Border-top:     1px solid rgba(255,255,255,0.1)
Padding:        py-24 (96px vertical)
Layout:         4-column grid at desktop, single column mobile
Logo:           headline-md, Outfit, font-bold, tracking-tighter
Description:    body-md, on-surface-variant (under logo)
Column heads:   label-bold, on-surface, uppercase, mb-4
Links:          body-md, on-tertiary-container, opacity-80
Link hover:     text-on-surface, underline decoration-primary, underline-offset-4, opacity-100
Link transition: transition-opacity
Social cols:    Instagram, Facebook, YouTube
Links cols:     Programs, Trainers, Schedule
Legal cols:     Privacy Policy, Terms of Service
Copyright:      label-sm, on-surface-variant, opacity-50/60
Footer CTA:     "JOIN THE CLUB" — primary button (some pages have this in col-4)
```

### Stats / Metric Block

```
Background:     surface (#121413) with border-white/10
Layout:         Flex justify-between items-center
Label:          label-sm, text-on-surface/60, uppercase, block mb-1
Value:          headline-md, text-on-surface
Icon:           Material Symbols, text-4xl, text-on-surface/20
Hover:          border-primary-container/50, value color → primary-container
Transition:     border-color + colors
Used on:        Trainer detail stats (Record, Black Belt, Champions)
```

### Numbered Development List

```
Number:         headline-md, text-primary (e.g., "01", "02")
Title:          label-bold, on-surface, uppercase, mb-1
Body:           body-md, on-surface-variant
Layout:         flex items-start gap-4
Divider:        border-b border-white/10 (between section heading and list)
```

### Section Heading with Left Border Accent

```
Text:           body-lg, text-on-secondary-container
Border-left:    2px solid primary-container (#ff571a)
Padding-left:   base (8px) or pl-6 (24px)
Use:            Introductory/mission text blocks
```

### Kinetic Radial Background (Subtle)

```
CSS:
  background-image:
    radial-gradient(circle at top right, rgba(255,87,26,0.05), transparent 50%),
    radial-gradient(circle at bottom left, rgba(255,87,26,0.02), transparent 40%);
Use:            Trainer detail page, subtle atmospheric depth
```

---

## Shape Language

**HARD EDGES ONLY. Zero border-radius on all content elements.**

| Element | Border Radius |
|---------|--------------|
| All Buttons | `0px` — no rounding |
| All Cards | `0px` |
| All Images | `0px` |
| All Inputs | `0px` |
| All Badges | `0px` |
| Discipline Tags | `0px` (ghost-border px-3 py-1 style) |
| Gallery Items | `0px` |
| **Exception** | `rounded-full` for facility section labels (e.g., "01 / TRAINING FLOOR") only |

---

## Motion

### All Transitions (Interaction-Triggered Only)

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Nav links | color | 200ms | ease |
| Primary button hover | background-color | 300ms | ease |
| Secondary button hover | background-color | 300ms | ease |
| Button active press | transform scale(0.95) | instant | — |
| Card image hover | transform scale(1.05) | 500ms | ease |
| Program image hover | transform scale(1.05) | 700ms | ease |
| Trainer image grayscale | filter grayscale | 500ms | ease |
| Gallery image | transform scale(1.05) | 500ms | cubic-bezier(0.25,1,0.5,1) |
| Gallery hover overlay | opacity 0 to 1 | 300ms | ease |
| Lightbox open/close | opacity | 300ms | ease |
| Form success state | opacity | 300ms | ease |
| Footer links | opacity | (transition-opacity) | ease |
| Membership card hover | border-color | 300ms | ease |
| Stat block hover | border-color, color | (default) | ease |
| Nav logo active | scale(0.90–0.95) | instant | — |

### Motion Rules

- No decorative animations that loop automatically
- All animations are **interaction-triggered** (hover, active, focus, click)
- The grayscale → color transition on trainer cards is a deliberate editorial technique
- Lightbox uses `backdrop-blur-sm` for atmospheric depth
- Scale animations always stay within the element's sharp rectangular boundary

---

## Image Direction

### Hero Images (Full-Viewport)

- **Height:** `h-[80vh]` or `min-h-[921px]`
- **Object fit:** `cover`, position `center`
- **Overlay 1:** `bg-gradient-to-t from-background via-background/60 to-transparent`
- **Overlay 2:** `bg-black/40` (additional darkness for legibility)
- **Visual style:** High-contrast, cinematic, dramatic lighting, deep blacks, moody atmosphere
- **Kinetic orange accents:** Orange light reflections in scene (photo direction, not CSS)

### Program Card Images

- **Height:** `h-80` (320px) fixed within card
- **Blend mode:** `mix-blend-luminosity`
- **Opacity:** 40% at rest → 60% on hover
- **Scale:** 1.05x on hover, 700ms transition
- **Frame:** Always within sharp rectangular container (0px radius)

### Trainer Directory Images

- **Height:** `h-[600px]` in editorial grid
- **Filter:** `grayscale` at rest → `grayscale-0` on hover (500ms)
- **Scale:** `group-hover:scale-105`, 500ms
- **Gradient:** `bg-gradient-to-t from-background to-transparent opacity-80`
- **Editorial alternate:** Trainer 2 has gradient-to-b (top instead of bottom)

### Trainer Detail Hero

- **Height:** `min-h-[921px]`
- **Blend:** `mix-blend-luminosity`, opacity 80%
- **Gradients:** Dual gradient — top-to-bottom + left-to-right (2/3 width)
- **Text overlay:** Display-lg text at bottom; wide grid layout

### Facility Images

- **Height:** `h-[60vh]` or `h-[70vh]`
- **Filter:** None — full color (facility photography = real asset showcase)
- **Scale on hover:** `scale-105`, `cubic-bezier(0.25,1,0.5,1)`
- **Container:** `overflow-hidden`, ghost-border
- **Lightbox:** Click to open fullscreen overlay

### Gallery Images

- **Layout:** Bento/masonry, `auto-rows-[250px]`
- **Filter:** None — full color
- **Scale on hover:** `scale-105`
- **Cursor:** `cursor-pointer`
- **Click:** Opens lightbox with `backdrop-blur-sm` overlay

---

## CTA Hierarchy

### Primary

**`BOOK A TRIAL`** — Always primary button (Kinetic Orange #ff571a, black text, no radius)

Always visible in header. Used for all trial/booking CTAs.

### Secondary

**`WHATSAPP US`** / **`CHAT ON WHATSAPP`** — Ghost/surface button with chat icon

Appears alongside primary CTA in forms and CTAs.

### Tertiary Actions

| CTA Text | Context | Style |
|----------|---------|-------|
| `CALL` | Contact, header | Link or ghost button |
| `GET DIRECTIONS` | Contact, footer | Link or ghost button |
| `VIEW FULL SCHEDULE` | Trainer, programs | Text link with arrow_forward icon |
| `EXPLORE PROGRAMS` | Homepage | Text link or secondary button |
| `INQUIRE NOW` | Membership cards | Primary button (full width) |
| `COMMIT TO A YEAR` | Annual membership | Primary button |
| `BOOK A PRIVATE SESSION` | Trainer detail CTA | Primary button (black bg on orange section) |
| `JOIN THE CLUB` / `JOIN NOW` | Footer, general | Primary button |
| `TRAIN WITH THE RIGHT COACH` | Trainers page CTA | Primary button |
| `RECOVERY PROTOCOLS` | Facilities page | Primary button |
| `RETURN TO SITE` | Book trial transactional | Text link with arrow_back icon |

### Text Link Style

```
color:           primary-container (#ff571a) or on-tertiary-container
hover:           text-on-surface + underline decoration-primary + opacity 80→100
underline-offset: 4px
arrow icon:      Material Symbols "arrow_outward" or "arrow_forward"
```

---

## Responsive Rules

### Mobile (< 768px)

| Element | Mobile Behavior |
|---------|----------------|
| Navigation | Hamburger menu icon (Material Symbols "menu"), all links hidden |
| Logo | Same position, same font |
| Header CTA | Hidden (`hidden md:inline-block`) |
| Container padding | `px-margin-mobile` (20px) |
| 12-col grid | Collapses to single column (`grid-cols-1`) |
| display-lg text | Scales down: `text-[40px]` to `text-[48px]` |
| headline-xl | Uses `headline-xl-mobile` (36px) or stays 48px |
| Trainer cards | Image stacks above content vertically; content becomes `absolute bottom-0` panel with `backdrop-blur-sm` |
| Trainer alternating | `order-1 md:order-2` / `order-2 md:order-1` technique |
| Gallery | Single column |
| Footer | Single column, stacked |
| Form inputs | Full-width, stacked fields |
| Membership grid | Single column |
| Section spacing | Reduced but still significant |

### Desktop (>= 768px)

| Element | Desktop Behavior |
|---------|----------------|
| Navigation | Full horizontal nav, `px-margin-desktop` (64px), CTA visible |
| Grid | 12-column editorial layouts active |
| Trainer cards | Side-by-side editorial layout |
| Gallery | Full bento grid |
| Footer | 4-column grid |
| Container | Max 1280px, centered with `mx-auto` |

### Book a Trial — Dedicated Mobile Screen

Stitch contains a dedicated mobile screen (`7d9151072c8c4961903dcf97b0361efe`, 390px wide) for the booking form. Mobile view should be treated as a primary design specification for this page.

---

## Navigation Structure

Confirmed desktop navigation order from Stitch:

1. **Home**
2. **Programs**
3. **Trainers**
4. **Schedule**
5. **Membership**
6. **About**

Header CTA: **BOOK A TRIAL** (always primary button)

Active link: `text-primary` color + `border-b border-primary pb-1`

Transactional pages (e.g., Book a Trial): Nav links are hidden. Only logo + "Return to Site" link is shown.

---

## Confirmed Screens from Stitch

| Screen Title | Stitch ID | Planned Route |
|-------------|-----------|--------------|
| Revive Fight Club — Homepage Foundation | `cebcc010157e4f4e8b6a92b420481f3f` | `/` |
| Programs Overview | `99524c21c47745689eb716a86c35e6bb` | `/programs` |
| Program Detail | `e3e3db926843469cb4d3f729054ec2e7` | `/programs/[slug]` |
| Trainers | `3a740c6efceb45c98756aeebee8185e7` | `/trainers` |
| Trainer Profile | `f30abc3549f84460be532ab4eae03d0a` | `/trainers/[slug]` |
| Schedule | `f36164622cf945009846595c4ebffa31` | `/schedule` |
| Membership | `83757828fe21407c9fcdf73e581a0f9c` | `/membership` |
| About | `9b0c72b9e48b4448b525e6b86b94d7fc` | `/about` |
| Facilities and Gallery | `d7109882cc354e969b2b124ae8408360` | `/facilities` |
| Reviews and FAQ | `e0d233278a6b46a184e0659284db2fc5` | `/reviews` |
| Contact | `1b516cb9be69472f9bbd7aa44d95657f` | `/contact` |
| Book a Trial (Desktop) | `1a4102a78b9847ff82779759e15be720` | `/book-trial` |
| Book a Trial (Mobile) | `7d9151072c8c4961903dcf97b0361efe` | `/book-trial` (mobile) |

---

## Business Information

> WARNING: The following appears in Stitch as prototype placeholder data.
> Real business information must be confirmed and supplied before Phase 2.

| Field | Stitch Placeholder | Status |
|-------|-------------------|--------|
| Location | Frazer Town, Bengaluru | To confirm |
| Phone | +91 9876543210 | Placeholder only |
| Hours | Mon-Sat 06:00 - 22:00 | To confirm |
| Email | info@revivefightclub.com | To confirm |
| Google Rating | 5.0 | To confirm with real data |
| Review count | 126+ Verified Athlete Reviews | To confirm with real data |
| Instagram | @REVIVEFIGHTCLUB | To confirm handle |
| Copyright year | 2024 | Update to current year |
