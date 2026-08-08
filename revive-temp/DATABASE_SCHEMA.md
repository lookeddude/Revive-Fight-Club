# DATABASE SCHEMA — Revive Fight Club

## Entity Relationship Overview

```
programs ─── schedule_items ─── trainers
    │
    └─── trial_requests
```

---

## programs

Stores all MMA/fitness training programs offered by Revive Fight Club.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| slug | TEXT | UNIQUE NOT NULL, regex `^[a-z0-9-]+$` | URL-safe identifier |
| name | TEXT | NOT NULL | Display name |
| short_description | TEXT | nullable | Used in cards/listings |
| description | TEXT | nullable | Full program description |
| image_path | TEXT | nullable | Storage path or URL |
| duration_minutes | INTEGER | CHECK > 0, nullable | Class duration |
| level | program_level enum | NOT NULL DEFAULT 'all_levels' | Skill level |
| category | TEXT | nullable | e.g. "STRIKING", "GRAPPLING" |
| is_featured | BOOLEAN | NOT NULL DEFAULT false | Show on homepage |
| is_active | BOOLEAN | NOT NULL DEFAULT true | Published state |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | Display order |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Auto |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Auto-updated by trigger |

**Indexes:** slug, is_active, is_featured, sort_order

---

## trainers

Coaching staff profiles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| slug | TEXT | UNIQUE NOT NULL, regex | URL-safe identifier |
| name | TEXT | NOT NULL | Full name |
| role | TEXT | NOT NULL | Job title |
| short_bio | TEXT | nullable | Listing card bio |
| bio | TEXT | nullable | Full profile bio |
| profile_image_path | TEXT | nullable | Storage path |
| specialties | TEXT[] | DEFAULT '{}' | List of disciplines |
| years_experience | INTEGER | CHECK >= 0, nullable | Years in role |
| is_featured | BOOLEAN | NOT NULL DEFAULT false | Homepage display |
| is_active | BOOLEAN | NOT NULL DEFAULT true | Published state |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | Display order |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**Indexes:** slug, is_active, is_featured, sort_order

---

## schedule_items

Weekly class schedule entries. References programs and trainers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| program_id | UUID | FK → programs.id ON DELETE RESTRICT | Required |
| trainer_id | UUID | FK → trainers.id ON DELETE SET NULL | Optional |
| day_of_week | SMALLINT | NOT NULL, CHECK 0–6 | 0=Sun, 6=Sat |
| start_time | TIME | NOT NULL | Class start |
| end_time | TIME | NOT NULL, CHECK > start_time | Class end |
| level | program_level enum | nullable | Skill filter |
| location | TEXT | DEFAULT 'Main Training Floor' | Room/area |
| is_active | BOOLEAN | NOT NULL DEFAULT true | Published state |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**Indexes:** program_id, trainer_id, day_of_week, is_active

---

## membership_plans

Pricing tiers for gym membership.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| slug | TEXT | UNIQUE NOT NULL | URL identifier |
| name | TEXT | NOT NULL | Plan display name |
| description | TEXT | nullable | Description |
| price | NUMERIC(10,2) | CHECK >= 0, nullable | NULL until finalized |
| billing_period | billing_period enum | NOT NULL DEFAULT 'monthly' | Billing cadence |
| features | TEXT[] | DEFAULT '{}' | Feature list |
| is_featured | BOOLEAN | NOT NULL DEFAULT false | Highlighted plan |
| is_active | BOOLEAN | NOT NULL DEFAULT true | Published state |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | Display order |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**Indexes:** slug, is_active, sort_order

---

## reviews

Athlete testimonials/reviews (manually curated, not automatically imported).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| reviewer_name | TEXT | NOT NULL | Display name |
| rating | SMALLINT | NOT NULL, CHECK 1–5 | Star rating |
| review_text | TEXT | NOT NULL | Review body |
| source | review_source enum | NOT NULL DEFAULT 'google' | Review origin |
| review_date | DATE | nullable | When reviewed |
| reviewer_role | TEXT | nullable | e.g. "BJJ Purple Belt" |
| is_featured | BOOLEAN | NOT NULL DEFAULT false | Homepage display |
| is_published | BOOLEAN | NOT NULL DEFAULT false | Public visibility |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | Display order |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**Indexes:** is_published, is_featured, rating, sort_order

---

## faqs

Frequently asked questions for the website.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| question | TEXT | NOT NULL | Question text |
| answer | TEXT | NOT NULL | Answer text |
| category | TEXT | DEFAULT 'general' | Grouping |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | Display order |
| is_published | BOOLEAN | NOT NULL DEFAULT false | Public visibility |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**Indexes:** category, is_published, sort_order

---

## facilities

Gym facility/equipment descriptions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| slug | TEXT | UNIQUE NOT NULL | URL identifier |
| name | TEXT | NOT NULL | Facility name |
| description | TEXT | nullable | Description |
| image_path | TEXT | nullable | Storage path |
| is_featured | BOOLEAN | NOT NULL DEFAULT false | Homepage display |
| is_active | BOOLEAN | NOT NULL DEFAULT true | Published state |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | Display order |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**Indexes:** slug, is_active, sort_order

---

## gallery_items

Photo gallery images for the website.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| title | TEXT | nullable | Caption |
| description | TEXT | nullable | Alt/description |
| image_path | TEXT | NOT NULL | Storage path |
| category | gallery_category enum | NOT NULL DEFAULT 'training' | Filter group |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | Display order |
| is_featured | BOOLEAN | NOT NULL DEFAULT false | Featured flag |
| is_published | BOOLEAN | NOT NULL DEFAULT false | Public visibility |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**gallery_category values:** training, gym, coaches, community, events

**Indexes:** category, is_published, is_featured, sort_order

---

## business_settings

Singleton table (enforced by `id = 1` constraint) containing business contact information.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Always 1 |
| business_name | TEXT | NOT NULL |
| tagline | TEXT | nullable |
| phone | TEXT | nullable |
| whatsapp_number | TEXT | nullable |
| email | TEXT | nullable |
| address | TEXT | nullable |
| city | TEXT | DEFAULT 'Bengaluru' |
| state | TEXT | DEFAULT 'Karnataka' |
| postal_code | TEXT | nullable |
| google_maps_url | TEXT | nullable |
| instagram_url | TEXT | nullable |
| facebook_url | TEXT | nullable |
| youtube_url | TEXT | nullable |
| opening_hours | JSONB | JSON object, default '{}' |
| latitude / longitude | NUMERIC | nullable |
| updated_at | TIMESTAMPTZ | Auto |

---

## trial_requests

Trial class booking requests submitted via the public form.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | TEXT | NOT NULL, CHECK length >= 2 | Submitter name |
| phone | TEXT | NOT NULL, CHECK length >= 7 | Phone number |
| email | TEXT | NOT NULL, regex validated | Email address |
| program_id | UUID | FK → programs.id ON DELETE SET NULL | Requested program |
| preferred_date | DATE | nullable | Requested date |
| preferred_time | TIME | nullable | Requested time |
| message | TEXT | CHECK length <= 2000, nullable | Optional message |
| status | trial_request_status enum | NOT NULL DEFAULT 'pending' | Workflow state |
| admin_notes | TEXT | nullable, admin-only | Internal notes |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**status values:** pending, contacted, confirmed, completed, cancelled, no_show

**Indexes:** status, created_at DESC, program_id, preferred_date

> ⚠️ Anonymous users cannot INSERT directly. Must use `submit_trial_request()` RPC.

---

## contact_enquiries

Contact form submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | TEXT | NOT NULL, CHECK length >= 2 | Submitter name |
| phone | TEXT | nullable, CHECK length >= 7 | Phone (optional) |
| email | TEXT | NOT NULL, regex validated | Email |
| subject | TEXT | NOT NULL, CHECK length >= 3 | Subject |
| message | TEXT | NOT NULL, CHECK 10–5000 chars | Message body |
| status | contact_enquiry_status enum | NOT NULL DEFAULT 'new' | Workflow state |
| admin_notes | TEXT | nullable, admin-only | Internal notes |
| created_at / updated_at | TIMESTAMPTZ | Auto | Timestamps |

**status values:** new, contacted, resolved, spam

**Indexes:** status, created_at DESC

> ⚠️ Anonymous users cannot INSERT directly. Must use `submit_contact_enquiry()` RPC.

---

## Enums

| Enum | Values |
|------|--------|
| program_level | beginner, intermediate, advanced, all_levels |
| billing_period | monthly, quarterly, annually |
| review_source | google, facebook, internal, other |
| trial_request_status | pending, contacted, confirmed, completed, cancelled, no_show |
| contact_enquiry_status | new, contacted, resolved, spam |
| gallery_category | training, gym, coaches, community, events |

---

## Relationship Diagram

```
programs
  ├── schedule_items (via program_id FK, ON DELETE RESTRICT)
  └── trial_requests (via program_id FK, ON DELETE SET NULL)

trainers
  └── schedule_items (via trainer_id FK, ON DELETE SET NULL)
```

**ON DELETE RESTRICT** on `schedule_items.program_id`:
A program cannot be deleted while it has schedule entries. Admin must remove schedule entries first.

**ON DELETE SET NULL** on `trial_requests.program_id` and `schedule_items.trainer_id`:
If a program/trainer is deleted, references are set to NULL rather than losing the record.
