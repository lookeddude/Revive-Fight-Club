-- ============================================================
-- MIGRATION 003: Schedule, Gallery, Reviews, FAQs
-- ============================================================

-- ── SCHEDULE ITEMS ────────────────────────────────────────────
CREATE TABLE public.schedule_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id  UUID NOT NULL REFERENCES public.programs(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  trainer_id  UUID REFERENCES public.trainers(id) ON DELETE SET NULL ON UPDATE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  level       public.program_level DEFAULT 'all_levels',
  location    TEXT DEFAULT 'Main Training Floor',
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT schedule_time_check CHECK (end_time > start_time)
);

CREATE INDEX idx_schedule_program_id  ON public.schedule_items (program_id);
CREATE INDEX idx_schedule_trainer_id  ON public.schedule_items (trainer_id);
CREATE INDEX idx_schedule_day         ON public.schedule_items (day_of_week);
CREATE INDEX idx_schedule_is_active   ON public.schedule_items (is_active);

-- ── GALLERY ITEMS ──────────────────────────────────────────────
CREATE TABLE public.gallery_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT,
  description TEXT,
  image_path  TEXT NOT NULL,
  category    public.gallery_category NOT NULL DEFAULT 'training',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gallery_category     ON public.gallery_items (category);
CREATE INDEX idx_gallery_is_published ON public.gallery_items (is_published);
CREATE INDEX idx_gallery_is_featured  ON public.gallery_items (is_featured);
CREATE INDEX idx_gallery_sort_order   ON public.gallery_items (sort_order);

-- ── REVIEWS ──────────────────────────────────────────────────────
CREATE TABLE public.reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_name TEXT NOT NULL,
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text   TEXT NOT NULL,
  source        public.review_source NOT NULL DEFAULT 'google',
  review_date   DATE,
  reviewer_role TEXT,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_is_published ON public.reviews (is_published);
CREATE INDEX idx_reviews_is_featured  ON public.reviews (is_featured);
CREATE INDEX idx_reviews_rating       ON public.reviews (rating);
CREATE INDEX idx_reviews_sort_order   ON public.reviews (sort_order);

-- ── FAQS ────────────────────────────────────────────────────────
CREATE TABLE public.faqs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  category     TEXT DEFAULT 'general',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faqs_category     ON public.faqs (category);
CREATE INDEX idx_faqs_is_published ON public.faqs (is_published);
CREATE INDEX idx_faqs_sort_order   ON public.faqs (sort_order);
