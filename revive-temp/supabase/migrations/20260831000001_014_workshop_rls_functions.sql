-- ============================================================
-- Migration 014: Workshop System — Indexes, RLS, DB Functions
-- Revive Fight Club
-- ============================================================

-- ── 1. Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS workshops_status_idx ON public.workshops(status);
CREATE INDEX IF NOT EXISTS workshops_featured_idx ON public.workshops(is_featured, featured_order) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS workshops_start_datetime_idx ON public.workshops(start_datetime);
CREATE INDEX IF NOT EXISTS workshops_slug_idx ON public.workshops(slug);

CREATE INDEX IF NOT EXISTS ws_instructors_workshop_idx ON public.workshop_instructors(workshop_id);
CREATE INDEX IF NOT EXISTS ws_faqs_workshop_idx ON public.workshop_faqs(workshop_id);
CREATE INDEX IF NOT EXISTS ws_fields_workshop_idx ON public.workshop_registration_fields(workshop_id);

CREATE INDEX IF NOT EXISTS ws_reg_workshop_id_idx ON public.workshop_registrations(workshop_id);
CREATE INDEX IF NOT EXISTS ws_reg_email_idx ON public.workshop_registrations(lower(email));
CREATE INDEX IF NOT EXISTS ws_reg_user_id_idx ON public.workshop_registrations(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS ws_reg_status_idx ON public.workshop_registrations(registration_status);
CREATE INDEX IF NOT EXISTS ws_reg_qr_token_idx ON public.workshop_registrations(qr_token);
CREATE INDEX IF NOT EXISTS ws_reg_created_at_idx ON public.workshop_registrations(created_at DESC);

-- Unique index: prevent duplicate active registrations per email per workshop
CREATE UNIQUE INDEX IF NOT EXISTS no_duplicate_active_registration
  ON public.workshop_registrations(workshop_id, lower(email))
  WHERE registration_status IN ('pending','confirmed','waitlisted');

-- ── 2. Row Level Security ─────────────────────────────────────

-- workshops
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workshops_public_read"
  ON public.workshops FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "workshops_admin_all"
  ON public.workshops FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('superadmin','admin','manager','receptionist')
      AND profiles.is_active = true
    )
  );

-- workshop_instructors
ALTER TABLE public.workshop_instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ws_instructors_public_read"
  ON public.workshop_instructors FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workshops w
      WHERE w.id = workshop_id AND w.status = 'published'
    )
  );

CREATE POLICY "ws_instructors_admin_all"
  ON public.workshop_instructors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('superadmin','admin','manager')
      AND profiles.is_active = true
    )
  );

-- workshop_faqs
ALTER TABLE public.workshop_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ws_faqs_public_read"
  ON public.workshop_faqs FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workshops w
      WHERE w.id = workshop_id AND w.status = 'published'
    )
  );

CREATE POLICY "ws_faqs_admin_all"
  ON public.workshop_faqs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('superadmin','admin','manager')
      AND profiles.is_active = true
    )
  );

-- workshop_registration_fields
ALTER TABLE public.workshop_registration_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ws_fields_public_read"
  ON public.workshop_registration_fields FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workshops w
      WHERE w.id = workshop_id AND w.status = 'published'
    )
  );

CREATE POLICY "ws_fields_admin_all"
  ON public.workshop_registration_fields FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('superadmin','admin','manager')
      AND profiles.is_active = true
    )
  );

-- workshop_registrations
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ws_reg_own_read"
  ON public.workshop_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "ws_reg_admin_all"
  ON public.workshop_registrations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('superadmin','admin','manager','receptionist')
      AND profiles.is_active = true
    )
  );

-- ── 3. Atomic registration function ──────────────────────────
CREATE OR REPLACE FUNCTION register_for_workshop(
  p_workshop_id         UUID,
  p_user_id             UUID,
  p_full_name           TEXT,
  p_email               TEXT,
  p_phone               TEXT,
  p_custom_answers      JSONB,
  p_ip_fingerprint      TEXT,
  p_qr_token            TEXT,
  p_is_paid             BOOLEAN DEFAULT false
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_workshop          public.workshops%ROWTYPE;
  v_active_count      INTEGER;
  v_reg_id            TEXT;
  v_seq_num           BIGINT;
  v_reg               public.workshop_registrations%ROWTYPE;
  v_status            registration_status;
  v_payment_status    ws_payment_status;
  v_expires_at        TIMESTAMPTZ;
BEGIN
  -- Lock workshop row to prevent race conditions
  SELECT * INTO v_workshop
  FROM public.workshops
  WHERE id = p_workshop_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'WORKSHOP_NOT_FOUND');
  END IF;

  -- Verify workshop is published
  IF v_workshop.status <> 'published' THEN
    RETURN jsonb_build_object('success', false, 'error', 'WORKSHOP_NOT_AVAILABLE');
  END IF;

  -- Check registration deadline
  IF v_workshop.registration_deadline IS NOT NULL
     AND v_workshop.registration_deadline < NOW() AT TIME ZONE 'Asia/Kolkata' THEN
    RETURN jsonb_build_object('success', false, 'error', 'REGISTRATION_CLOSED');
  END IF;

  -- Expire stale pending paid reservations
  UPDATE public.workshop_registrations
  SET registration_status = 'cancelled'
  WHERE workshop_id = p_workshop_id
    AND registration_status = 'pending'
    AND reservation_expires_at IS NOT NULL
    AND reservation_expires_at < NOW();

  -- Count active seats (confirmed + pending, NOT waitlisted/cancelled)
  SELECT COUNT(*) INTO v_active_count
  FROM public.workshop_registrations
  WHERE workshop_id = p_workshop_id
    AND registration_status IN ('confirmed','pending');

  -- Capacity check
  IF v_workshop.capacity IS NOT NULL AND v_active_count >= v_workshop.capacity THEN
    IF v_workshop.waitlist_enabled THEN
      v_status := 'waitlisted';
      v_payment_status := 'not_required';
      v_expires_at := NULL;
    ELSE
      RETURN jsonb_build_object('success', false, 'error', 'WORKSHOP_FULL');
    END IF;
  ELSE
    IF p_is_paid THEN
      v_status := 'pending';
      v_payment_status := 'pending';
      v_expires_at := NOW() + INTERVAL '15 minutes';
    ELSE
      v_status := 'confirmed';
      v_payment_status := 'not_required';
      v_expires_at := NULL;
    END IF;
  END IF;

  -- Generate registration ID
  v_seq_num := nextval('public.workshop_registration_seq');
  v_reg_id := 'RFC-WS-' || to_char(NOW(), 'YYYY') || '-' || lpad(v_seq_num::TEXT, 6, '0');

  -- Insert registration
  INSERT INTO public.workshop_registrations (
    registration_id, workshop_id, user_id,
    full_name, email, phone, custom_answers,
    registration_status, payment_status,
    qr_token, ip_fingerprint, reservation_expires_at
  ) VALUES (
    v_reg_id, p_workshop_id, p_user_id,
    p_full_name, lower(p_email), p_phone, p_custom_answers,
    v_status, v_payment_status,
    p_qr_token, p_ip_fingerprint, v_expires_at
  )
  RETURNING * INTO v_reg;

  RETURN jsonb_build_object(
    'success', true,
    'registrationId', v_reg_id,
    'registrationUuid', v_reg.id,
    'status', v_status,
    'paymentStatus', v_payment_status,
    'expiresAt', v_expires_at
  );

EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'DUPLICATE_REGISTRATION');
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'INTERNAL_ERROR', 'detail', SQLERRM);
END;
$$;

-- ── 4. Confirm workshop payment (idempotent) ──────────────────
CREATE OR REPLACE FUNCTION confirm_workshop_payment(
  p_razorpay_order_id    TEXT,
  p_razorpay_payment_id  TEXT,
  p_razorpay_signature   TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment   public.payments%ROWTYPE;
  v_reg       public.workshop_registrations%ROWTYPE;
BEGIN
  -- Find payment
  SELECT * INTO v_payment
  FROM public.payments
  WHERE razorpay_order_id = p_razorpay_order_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment record not found');
  END IF;

  -- Idempotency check
  IF v_payment.status = 'paid' THEN
    -- Find the registration for response
    SELECT * INTO v_reg
    FROM public.workshop_registrations
    WHERE payment_id = v_payment.id
    LIMIT 1;
    RETURN jsonb_build_object(
      'success', true,
      'idempotent', true,
      'registrationId', v_reg.registration_id
    );
  END IF;

  -- Update payment to paid
  UPDATE public.payments SET
    razorpay_payment_id = p_razorpay_payment_id,
    razorpay_signature  = p_razorpay_signature,
    status              = 'paid',
    updated_at          = NOW()
  WHERE id = v_payment.id;

  -- Confirm workshop registration
  UPDATE public.workshop_registrations SET
    registration_status     = 'confirmed',
    payment_status          = 'paid',
    reservation_expires_at  = NULL,
    updated_at              = NOW()
  WHERE payment_id = v_payment.id
  RETURNING * INTO v_reg;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration record not found');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'registrationId', v_reg.registration_id,
    'registrationUuid', v_reg.id
  );
END;
$$;
