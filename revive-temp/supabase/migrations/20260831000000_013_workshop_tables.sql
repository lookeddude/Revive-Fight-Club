-- ============================================================
-- Migration 013: Workshop Management System — Core Tables
-- Revive Fight Club
-- ============================================================

-- ── 1. Enums ──────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE workshop_status AS ENUM ('draft','published','closed','completed','cancelled','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE workshop_mode AS ENUM ('in_person','online','hybrid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE pricing_type AS ENUM ('free','paid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE registration_status AS ENUM ('pending','confirmed','cancelled','waitlisted','attended','no_show');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ws_payment_status AS ENUM ('not_required','pending','paid','failed','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE form_field_type AS ENUM ('text','email','phone','number','date','select','radio','checkbox','textarea');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 2. Extend payments.payment_type check ────────────────────
-- Add 'workshop' to allowed values
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_payment_type_check;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_payment_type_check
    CHECK (payment_type IN ('membership', 'trial', 'workshop'));

-- ── 3. workshops table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workshops (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  title                   TEXT NOT NULL CHECK (length(title) >= 3),
  short_description       TEXT CHECK (length(short_description) <= 300),
  description             TEXT,
  cover_image_path        TEXT,
  gallery_images          TEXT[] NOT NULL DEFAULT '{}',
  location                TEXT,
  online_meeting_url      TEXT,
  workshop_mode           workshop_mode NOT NULL DEFAULT 'in_person',
  start_datetime          TIMESTAMPTZ NOT NULL,
  end_datetime            TIMESTAMPTZ NOT NULL CHECK (end_datetime > start_datetime),
  registration_deadline   TIMESTAMPTZ,
  pricing_type            pricing_type NOT NULL DEFAULT 'free',
  price                   NUMERIC(10,2) CHECK (price >= 0),
  currency                TEXT NOT NULL DEFAULT 'INR',
  capacity                INTEGER CHECK (capacity > 0),
  waitlist_enabled        BOOLEAN NOT NULL DEFAULT false,
  status                  workshop_status NOT NULL DEFAULT 'draft',
  is_featured             BOOLEAN NOT NULL DEFAULT false,
  featured_order          INTEGER NOT NULL DEFAULT 0,
  what_you_learn          TEXT[] NOT NULL DEFAULT '{}',
  requirements            TEXT[] NOT NULL DEFAULT '{}',
  published_at            TIMESTAMPTZ,
  created_by              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. workshop_instructors ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workshop_instructors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id   UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  name          TEXT NOT NULL CHECK (length(name) >= 2),
  bio           TEXT,
  photo_path    TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. workshop_faqs ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workshop_faqs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id   UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  question      TEXT NOT NULL CHECK (length(question) >= 3),
  answer        TEXT NOT NULL CHECK (length(answer) >= 3),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. workshop_registration_fields ──────────────────────────
CREATE TABLE IF NOT EXISTS public.workshop_registration_fields (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id   UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  field_key     TEXT NOT NULL CHECK (field_key ~ '^[a-z_]+$'),
  label         TEXT NOT NULL,
  field_type    form_field_type NOT NULL DEFAULT 'text',
  required      BOOLEAN NOT NULL DEFAULT false,
  placeholder   TEXT,
  options       TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workshop_id, field_key)
);

-- ── 7. workshop_registrations ────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.workshop_registration_seq;

CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id         TEXT UNIQUE NOT NULL,
  workshop_id             UUID NOT NULL REFERENCES public.workshops(id) ON DELETE RESTRICT,
  user_id                 UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name               TEXT NOT NULL CHECK (length(full_name) >= 2),
  email                   TEXT NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  phone                   TEXT NOT NULL CHECK (length(phone) >= 7),
  custom_answers          JSONB NOT NULL DEFAULT '{}',
  registration_status     registration_status NOT NULL DEFAULT 'pending',
  payment_status          ws_payment_status NOT NULL DEFAULT 'not_required',
  payment_id              UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  amount_paid             NUMERIC(10,2),
  qr_token                TEXT UNIQUE NOT NULL,
  attendance_marked_at    TIMESTAMPTZ,
  attended_by             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_fingerprint          TEXT,
  reservation_expires_at  TIMESTAMPTZ,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 8. updated_at triggers ────────────────────────────────────
CREATE OR REPLACE TRIGGER workshops_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER workshop_registrations_updated_at
  BEFORE UPDATE ON public.workshop_registrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
