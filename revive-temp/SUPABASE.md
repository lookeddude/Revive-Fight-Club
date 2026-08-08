# SUPABASE — Revive Fight Club Backend

## Project

| Key | Value |
|-----|-------|
| Project Name | Revive Fight Club |
| Project Ref | `hnmtjcpmdywwtafgexxk` |
| Project URL | `https://hnmtjcpmdywwtafgexxk.supabase.co` |
| Region | ap-northeast-1 |
| PostgreSQL | v17.6 |
| Status | ACTIVE_HEALTHY |

---

## Database Architecture

The database is a normalized production relational schema.
It does NOT use a single monolithic table or JSON for structured data.

### Tables

| Table | Purpose | Public Read |
|-------|---------|-------------|
| `programs` | MMA/fitness training programs | ✅ active only |
| `trainers` | Coaching staff | ✅ active only |
| `facilities` | Gym facilities | ✅ active only |
| `membership_plans` | Membership pricing | ✅ active only |
| `schedule_items` | Weekly class schedule | ✅ active only |
| `gallery_items` | Photo gallery | ✅ published only |
| `reviews` | Athlete testimonials | ✅ published only |
| `faqs` | Frequently asked questions | ✅ published only |
| `business_settings` | Business contact/settings (singleton) | ✅ full row |
| `trial_requests` | Trial class booking requests | ❌ private |
| `contact_enquiries` | Contact form submissions | ❌ private |

### Entity Relationships

```
programs ──────────────────┐
    ↓ (program_id FK)       │
schedule_items              │
    ↓ (trainer_id FK)       │
trainers                    │
                            │
programs ◄──────────────────┘ (program_id FK)
    ↓
trial_requests
```

---

## Row Level Security

**RLS is enabled on all 11 application tables.**

### Public Read Policies

Anonymous users (`anon` role) can SELECT:

- `programs` where `is_active = true`
- `trainers` where `is_active = true`
- `facilities` where `is_active = true`
- `membership_plans` where `is_active = true`
- `schedule_items` where `is_active = true`
- `gallery_items` where `is_published = true`
- `reviews` where `is_published = true`
- `faqs` where `is_published = true`
- `business_settings` (all columns — no sensitive data present)

### Private Data

Anonymous users CANNOT access:
- `trial_requests` — no SELECT policy
- `contact_enquiries` — no SELECT policy
- No UPDATE, DELETE, or INSERT privileges on any content tables

### Public Form Submission

Form submissions use `SECURITY DEFINER` RPC functions, not direct table INSERT:

- `submit_trial_request()` — validates inputs, always sets `status = 'pending'`
- `submit_contact_enquiry()` — validates inputs, always sets `status = 'new'`

This prevents clients from:
- Setting their own status
- Injecting admin_notes
- Bypassing field validation

---

## Storage Buckets

| Bucket | Public | Max File Size | Allowed Types |
|--------|--------|---------------|---------------|
| `revive-trainers` | ✅ | 5 MB | jpeg, png, webp, avif |
| `revive-programs` | ✅ | 5 MB | jpeg, png, webp, avif |
| `revive-gallery` | ✅ | 10 MB | jpeg, png, webp, avif |
| `revive-facilities` | ✅ | 10 MB | jpeg, png, webp, avif |
| `revive-brand` | ✅ | 5 MB | jpeg, png, webp, avif, svg |

### Storage Security

- Anonymous: SELECT (read via CDN URL) only
- Authenticated: INSERT, UPDATE, DELETE (future admin panel)
- Anonymous: NO upload capability

### File Naming Convention

```
revive-trainers/{trainer-id}/profile.webp
revive-programs/{program-id}/cover.webp
revive-gallery/{gallery-item-id}/image.webp
revive-facilities/{facility-id}/image.webp
revive-brand/logo.webp
```

---

## Environment Variables

### Public (browser-safe)

```
NEXT_PUBLIC_SUPABASE_URL=https://hnmtjcpmdywwtafgexxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

### Server-only (NEVER expose to browser)

```
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

> ⚠️ The service role key bypasses RLS entirely. It must only ever be used in `lib/supabase/admin.ts` (to be created in Phase 5) and must NEVER appear in client-side code or be committed to git.

---

## Client Architecture

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser client — anon key, for client components |
| `lib/supabase/server.ts` | Server client — anon key with cookie support |
| `lib/supabase/admin.ts` | Admin client — service role (Phase 5, server-only) |
| `lib/data/content.ts` | Public content data access (programs, trainers, reviews, FAQs) |
| `lib/data/listings.ts` | Public listings (schedule, membership, facilities, gallery) |
| `lib/actions/forms.ts` | Server Actions for form submission |
| `types/database.ts` | Generated TypeScript types + domain aliases |

---

## Admin Authorization Strategy

Future admin access will use Supabase Auth with JWT claims.

**Approach:**
1. Admin users sign in via Supabase Auth (email/password)
2. A custom claim `user_role` is set to `'admin'` or `'manager'` via a database trigger or admin tool
3. RLS policies will use `(auth.jwt() ->> 'user_role') = 'admin'` to grant privileged access
4. The service role client (`admin.ts`) is used ONLY for operations that cannot be expressed in RLS (e.g. batch updates, seed operations)

**Admin capabilities (Phase 5):**
- All content tables: full CRUD
- trial_requests: SELECT, UPDATE status/notes
- contact_enquiries: SELECT, UPDATE status/notes
- business_settings: UPDATE
- Storage: upload/delete via signed URLs

**What admin cannot do:**
- Access other users' data (future public account system, if any)
- Bypass per-row constraints (e.g. rating 1–5)

---

## Migration Strategy

All schema changes are tracked as numbered migrations via the Supabase MCP:

| Migration | Description |
|-----------|-------------|
| `001_create_enums_and_extensions` | PostgreSQL enums for all controlled values |
| `002_create_core_content_tables` | programs, trainers, facilities, membership_plans |
| `003_create_schedule_gallery_reviews_faqs` | schedule_items, gallery_items, reviews, faqs |
| `004_create_business_settings_and_enquiries` | business_settings (singleton), trial_requests, contact_enquiries |
| `005_updated_at_triggers` | Auto-update trigger function applied to all tables |
| `006_row_level_security_public_content` | RLS enabled + public read policies |
| `007_rls_secure_write_policies` | SECURITY DEFINER functions + REVOKE direct writes |
| `008_storage_buckets_and_policies` | 5 storage buckets + storage RLS |

---

## Anti-Spam Considerations

Trial request and contact forms are currently protected by:
- Database-level input validation (constraints, regex checks)
- SECURITY DEFINER function (cannot set status = confirmed)
- No direct table INSERT access for anon

**Future Phase (Phase 6 or Phase 7):**
- Rate limiting via Supabase Edge Functions or middleware
- CAPTCHA (hCaptcha or Turnstile) on the form pages
- Honeypot fields
- IP-based submission throttling

---

## Public vs Private Data

| Category | Visibility |
|----------|------------|
| Active programs | Public |
| Active trainers | Public |
| Active schedule | Public |
| Active membership plans | Public |
| Published reviews | Public |
| Published FAQs | Public |
| Published gallery | Public |
| Business settings | Public (no sensitive fields) |
| Trial requests | Private (admin only) |
| Contact enquiries | Private (admin only) |
| admin_notes | Private (admin only) |
| Service role key | Server-only, never exposed |

---

## Security Checklist

- [x] RLS enabled on all 11 tables
- [x] No direct INSERT for anon on content tables
- [x] Form submissions via SECURITY DEFINER RPC
- [x] status field cannot be set by client on trial_requests
- [x] admin_notes not settable by client
- [x] No service role key in browser
- [x] No SELECT on trial_requests for anon
- [x] No SELECT on contact_enquiries for anon
- [x] Storage buckets: read-only for anon
- [x] Storage: authenticated write only
- [x] Environment files in .gitignore
- [x] No fake/fabricated data published
