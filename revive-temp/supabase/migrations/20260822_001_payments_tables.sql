-- ============================================================
-- Migration 001: Payment Tables
-- Revive Fight Club — Payment System
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── 1. payments table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_order_id     TEXT NOT NULL,
  razorpay_payment_id   TEXT,
  razorpay_signature    TEXT,
  customer_name         TEXT NOT NULL,
  customer_email        TEXT NOT NULL,
  customer_phone        TEXT NOT NULL,
  payment_type          TEXT NOT NULL CHECK (payment_type IN ('membership', 'trial')),
  reference_id          UUID,           -- FK to member_purchases.id or trial_requests.id (set after creation)
  amount                INTEGER NOT NULL CHECK (amount > 0),  -- in paise (₹1 = 100 paise)
  currency              TEXT NOT NULL DEFAULT 'INR',
  status                TEXT NOT NULL DEFAULT 'created'
                          CHECK (status IN ('created', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled')),
  failure_reason        TEXT,
  metadata              JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraints — prevent duplicate orders/payments
CREATE UNIQUE INDEX IF NOT EXISTS payments_razorpay_order_id_idx ON public.payments(razorpay_order_id);
CREATE UNIQUE INDEX IF NOT EXISTS payments_razorpay_payment_id_idx ON public.payments(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;

-- Performance indexes
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments(status);
CREATE INDEX IF NOT EXISTS payments_payment_type_idx ON public.payments(payment_type);
CREATE INDEX IF NOT EXISTS payments_customer_email_idx ON public.payments(customer_email);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payments(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 2. member_purchases table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.member_purchases (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_plan_id    UUID NOT NULL REFERENCES public.membership_plans(id) ON DELETE RESTRICT,
  payment_id            UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  customer_name         TEXT NOT NULL,
  customer_email        TEXT NOT NULL,
  customer_phone        TEXT NOT NULL,
  start_date            DATE,
  end_date              DATE,
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS member_purchases_plan_idx ON public.member_purchases(membership_plan_id);
CREATE INDEX IF NOT EXISTS member_purchases_payment_idx ON public.member_purchases(payment_id);
CREATE INDEX IF NOT EXISTS member_purchases_status_idx ON public.member_purchases(status);
CREATE INDEX IF NOT EXISTS member_purchases_email_idx ON public.member_purchases(customer_email);

-- Auto-update updated_at
CREATE OR REPLACE TRIGGER member_purchases_updated_at
  BEFORE UPDATE ON public.member_purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── 3. Extend trial_requests ───────────────────────────────────
ALTER TABLE public.trial_requests
  ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_required BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_fee INTEGER DEFAULT 100000; -- 100000 paise = ₹1,000

-- Add pending_payment to trial_request_status enum
-- NOTE: PostgreSQL enums cannot be modified easily. We extend the status via check or a new value.
-- If the enum already exists, run: ALTER TYPE trial_request_status ADD VALUE IF NOT EXISTS 'pending_payment';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'pending_payment'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'trial_request_status')
  ) THEN
    ALTER TYPE trial_request_status ADD VALUE 'pending_payment';
  END IF;
END $$;

-- ── 4. Row Level Security ──────────────────────────────────────

-- payments: no public access — all operations via service role (webhook/server)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can read payments (via existing admin auth pattern)
CREATE POLICY "Admin can read payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
      AND profiles.is_active = true
    )
  );

-- No public INSERT/UPDATE — only service role can modify
-- Service role bypasses RLS entirely

-- member_purchases: no public access
ALTER TABLE public.member_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read member_purchases"
  ON public.member_purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
      AND profiles.is_active = true
    )
  );

-- ── 5. Idempotent payment processing function ─────────────────
-- Called by webhook handler to safely update payment + activate membership/trial
CREATE OR REPLACE FUNCTION process_payment_success(
  p_razorpay_order_id    TEXT,
  p_razorpay_payment_id  TEXT,
  p_razorpay_signature   TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment     public.payments%ROWTYPE;
  v_purchase    public.member_purchases%ROWTYPE;
  v_plan        public.membership_plans%ROWTYPE;
  v_start_date  DATE;
  v_end_date    DATE;
  v_duration    INTEGER;
BEGIN
  -- Find payment by order ID
  SELECT * INTO v_payment
  FROM public.payments
  WHERE razorpay_order_id = p_razorpay_order_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment record not found');
  END IF;

  -- IDEMPOTENCY CHECK — already processed?
  IF v_payment.status = 'paid' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already processed', 'idempotent', true);
  END IF;

  -- Update payment to paid
  UPDATE public.payments SET
    razorpay_payment_id = p_razorpay_payment_id,
    razorpay_signature  = p_razorpay_signature,
    status              = 'paid',
    updated_at          = NOW()
  WHERE id = v_payment.id;

  -- Activate membership if type = 'membership'
  IF v_payment.payment_type = 'membership' AND v_payment.reference_id IS NOT NULL THEN
    -- Get plan duration
    SELECT mp.* INTO v_plan
    FROM public.member_purchases mpu
    JOIN public.membership_plans mp ON mp.id = mpu.membership_plan_id
    WHERE mpu.id = v_payment.reference_id;

    -- Calculate dates based on billing_period
    v_start_date := CURRENT_DATE;
    v_duration := CASE v_plan.billing_period
      WHEN 'monthly'   THEN 30
      WHEN 'quarterly' THEN 90
      WHEN 'annually'  THEN 365
      ELSE 30
    END;
    v_end_date := v_start_date + v_duration;

    UPDATE public.member_purchases SET
      status     = 'active',
      start_date = v_start_date,
      end_date   = v_end_date,
      updated_at = NOW()
    WHERE id = v_payment.reference_id;
  END IF;

  -- Confirm trial if type = 'trial'
  IF v_payment.payment_type = 'trial' AND v_payment.reference_id IS NOT NULL THEN
    UPDATE public.trial_requests SET
      status     = 'confirmed',
      payment_id = v_payment.id,
      updated_at = NOW()
    WHERE id = v_payment.reference_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'payment_id', v_payment.id);
END;
$$;
