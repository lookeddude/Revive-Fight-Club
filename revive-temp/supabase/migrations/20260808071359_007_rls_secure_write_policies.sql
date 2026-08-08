-- ============================================================
-- MIGRATION 007: Secure Write Policies — Public Form Submission
-- Anonymous INSERT for trial_requests and contact_enquiries ONLY.
-- Protected fields are controlled by the DB function, not the client.
-- ============================================================

CREATE OR REPLACE FUNCTION public.submit_trial_request(
  p_name           TEXT,
  p_phone          TEXT,
  p_email          TEXT,
  p_program_id     UUID DEFAULT NULL,
  p_preferred_date DATE DEFAULT NULL,
  p_preferred_time TIME DEFAULT NULL,
  p_message        TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF trim(p_name) = '' OR char_length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid name';
  END IF;
  IF trim(p_phone) = '' OR char_length(trim(p_phone)) < 7 THEN
    RAISE EXCEPTION 'Invalid phone number';
  END IF;
  IF p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address';
  END IF;
  IF p_message IS NOT NULL AND char_length(p_message) > 2000 THEN
    RAISE EXCEPTION 'Message too long';
  END IF;

  INSERT INTO public.trial_requests (
    name, phone, email, program_id, preferred_date, preferred_time, message, status
  )
  VALUES (
    trim(p_name), trim(p_phone), lower(trim(p_email)),
    p_program_id, p_preferred_date, p_preferred_time, p_message,
    'pending'
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_trial_request TO anon;

CREATE OR REPLACE FUNCTION public.submit_contact_enquiry(
  p_name    TEXT,
  p_email   TEXT,
  p_subject TEXT,
  p_message TEXT,
  p_phone   TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF trim(p_name) = '' OR char_length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid name';
  END IF;
  IF p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address';
  END IF;
  IF trim(p_subject) = '' OR char_length(trim(p_subject)) < 3 THEN
    RAISE EXCEPTION 'Subject too short';
  END IF;
  IF trim(p_message) = '' OR char_length(trim(p_message)) < 10 THEN
    RAISE EXCEPTION 'Message too short';
  END IF;
  IF char_length(p_message) > 5000 THEN
    RAISE EXCEPTION 'Message too long';
  END IF;

  INSERT INTO public.contact_enquiries (
    name, phone, email, subject, message, status
  )
  VALUES (
    trim(p_name), NULLIF(trim(COALESCE(p_phone, '')), ''),
    lower(trim(p_email)), trim(p_subject), trim(p_message),
    'new'
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_contact_enquiry TO anon;

REVOKE INSERT, UPDATE, DELETE ON public.trial_requests    FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.contact_enquiries FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.programs          FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.trainers          FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.facilities        FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.membership_plans  FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.schedule_items    FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.gallery_items     FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.reviews           FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.faqs              FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.business_settings FROM anon;
