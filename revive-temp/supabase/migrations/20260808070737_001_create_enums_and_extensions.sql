-- ============================================================
-- MIGRATION 001: Enums & Extensions
-- Revive Fight Club — Production Database
-- ============================================================

-- Ensure uuid generation is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────────

CREATE TYPE public.program_level AS ENUM (
  'beginner',
  'intermediate',
  'advanced',
  'all_levels'
);

CREATE TYPE public.billing_period AS ENUM (
  'monthly',
  'quarterly',
  'annually'
);

CREATE TYPE public.review_source AS ENUM (
  'google',
  'facebook',
  'internal',
  'other'
);

CREATE TYPE public.trial_request_status AS ENUM (
  'pending',
  'contacted',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE public.contact_enquiry_status AS ENUM (
  'new',
  'contacted',
  'resolved',
  'spam'
);

CREATE TYPE public.gallery_category AS ENUM (
  'training',
  'gym',
  'coaches',
  'community',
  'events'
);
