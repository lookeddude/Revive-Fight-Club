-- ============================================================
-- MIGRATION 006: Row Level Security — Public Content
-- Enable RLS on ALL tables. Grant public READ on published content.
-- ============================================================

ALTER TABLE public.programs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_active_programs"
  ON public.programs FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "public_read_active_trainers"
  ON public.trainers FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "public_read_active_facilities"
  ON public.facilities FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "public_read_active_membership_plans"
  ON public.membership_plans FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "public_read_active_schedule"
  ON public.schedule_items FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "public_read_published_gallery"
  ON public.gallery_items FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "public_read_published_reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "public_read_published_faqs"
  ON public.faqs FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "public_read_business_settings"
  ON public.business_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- trial_requests and contact_enquiries: NO public SELECT
-- Service role (server-only admin client) bypasses RLS by design.
