-- ============================================================
-- MIGRATION 004: Business Settings, Trial Requests, Contact Enquiries
-- ============================================================

-- ── BUSINESS SETTINGS (singleton) ───────────────────────────
CREATE TABLE public.business_settings (
  id                INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name     TEXT NOT NULL DEFAULT 'Revive Fight Club',
  tagline           TEXT,
  phone             TEXT,
  whatsapp_number   TEXT,
  email             TEXT,
  address           TEXT,
  city              TEXT DEFAULT 'Bengaluru',
  state             TEXT DEFAULT 'Karnataka',
  postal_code       TEXT,
  google_maps_url   TEXT,
  instagram_url     TEXT,
  facebook_url      TEXT,
  youtube_url       TEXT,
  opening_hours     JSONB DEFAULT '{}'::JSONB,
  latitude          NUMERIC(10, 8),
  longitude         NUMERIC(11, 8),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.business_settings (id, business_name, city, state)
VALUES (1, 'Revive Fight Club', 'Bengaluru', 'Karnataka');

-- ── TRIAL REQUESTS ─────────────────────────────────────────────
CREATE TABLE public.trial_requests (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL CHECK (char_length(trim(name)) >= 2),
  phone          TEXT NOT NULL CHECK (char_length(trim(phone)) >= 7),
  email          TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  program_id     UUID REFERENCES public.programs(id) ON DELETE SET NULL ON UPDATE CASCADE,
  preferred_date DATE,
  preferred_time TIME,
  message        TEXT CHECK (char_length(message) <= 2000),
  status         public.trial_request_status NOT NULL DEFAULT 'pending',
  admin_notes    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trial_requests_status         ON public.trial_requests (status);
CREATE INDEX idx_trial_requests_created_at     ON public.trial_requests (created_at DESC);
CREATE INDEX idx_trial_requests_program_id     ON public.trial_requests (program_id);
CREATE INDEX idx_trial_requests_preferred_date ON public.trial_requests (preferred_date);

-- ── CONTACT ENQUIRIES ────────────────────────────────────────
CREATE TABLE public.contact_enquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL CHECK (char_length(trim(name)) >= 2),
  phone       TEXT CHECK (char_length(trim(phone)) >= 7),
  email       TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject     TEXT NOT NULL CHECK (char_length(trim(subject)) >= 3),
  message     TEXT NOT NULL CHECK (char_length(trim(message)) >= 10 AND char_length(message) <= 5000),
  status      public.contact_enquiry_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_enquiries_status     ON public.contact_enquiries (status);
CREATE INDEX idx_contact_enquiries_created_at ON public.contact_enquiries (created_at DESC);
