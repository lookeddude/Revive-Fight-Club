-- ============================================================
-- MIGRATION 002: Core Content Tables
-- programs, trainers, facilities, membership_plans
-- ============================================================

-- ── PROGRAMS ─────────────────────────────────────────────────
CREATE TABLE public.programs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  short_description TEXT,
  description      TEXT,
  image_path       TEXT,
  duration_minutes INTEGER CHECK (duration_minutes > 0),
  level            public.program_level NOT NULL DEFAULT 'all_levels',
  category         TEXT,
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT programs_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_programs_slug        ON public.programs (slug);
CREATE INDEX idx_programs_is_active   ON public.programs (is_active);
CREATE INDEX idx_programs_is_featured ON public.programs (is_featured);
CREATE INDEX idx_programs_sort_order  ON public.programs (sort_order);

-- ── TRAINERS ─────────────────────────────────────────────────
CREATE TABLE public.trainers (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                 TEXT NOT NULL UNIQUE,
  name                 TEXT NOT NULL,
  role                 TEXT NOT NULL,
  short_bio            TEXT,
  bio                  TEXT,
  profile_image_path   TEXT,
  specialties          TEXT[] DEFAULT '{}',
  years_experience     INTEGER CHECK (years_experience >= 0),
  is_featured          BOOLEAN NOT NULL DEFAULT false,
  is_active            BOOLEAN NOT NULL DEFAULT true,
  sort_order           INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT trainers_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_trainers_slug        ON public.trainers (slug);
CREATE INDEX idx_trainers_is_active   ON public.trainers (is_active);
CREATE INDEX idx_trainers_is_featured ON public.trainers (is_featured);
CREATE INDEX idx_trainers_sort_order  ON public.trainers (sort_order);

-- ── FACILITIES ────────────────────────────────────────────────
CREATE TABLE public.facilities (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  description  TEXT,
  image_path   TEXT,
  is_featured  BOOLEAN NOT NULL DEFAULT false,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT facilities_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_facilities_slug       ON public.facilities (slug);
CREATE INDEX idx_facilities_is_active  ON public.facilities (is_active);
CREATE INDEX idx_facilities_sort_order ON public.facilities (sort_order);

-- ── MEMBERSHIP PLANS ──────────────────────────────────────────
CREATE TABLE public.membership_plans (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC(10, 2) CHECK (price >= 0),
  billing_period public.billing_period NOT NULL DEFAULT 'monthly',
  features       TEXT[] DEFAULT '{}',
  is_featured    BOOLEAN NOT NULL DEFAULT false,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT membership_plans_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_membership_plans_slug       ON public.membership_plans (slug);
CREATE INDEX idx_membership_plans_is_active  ON public.membership_plans (is_active);
CREATE INDEX idx_membership_plans_sort_order ON public.membership_plans (sort_order);
