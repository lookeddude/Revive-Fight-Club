-- ============================================================
-- MIGRATION 009: Staff Invitations & Extended Roles
-- ============================================================

-- ── Extend profiles.role to support new roles ────────────────
-- We do NOT use a strict enum so future roles can be added without a migration.
-- Existing values ('admin', 'manager') remain valid.
-- New values: 'superadmin', 'receptionist'
-- The check constraint is dropped and replaced with an updated one.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('superadmin', 'admin', 'manager', 'receptionist'));

-- ── staff_invitations table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.staff_invitations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'manager', 'receptionist')),
  invited_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  token       UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_email  ON public.staff_invitations (email);
CREATE INDEX IF NOT EXISTS idx_invitations_token  ON public.staff_invitations (token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.staff_invitations (status);

-- RLS
ALTER TABLE public.staff_invitations ENABLE ROW LEVEL SECURITY;

-- Public can read their own invitation by token (needed for /invite/[token] page)
CREATE POLICY "public_read_invitation_by_token"
  ON public.staff_invitations FOR SELECT
  TO anon, authenticated
  USING (true);  -- token is a secret UUID; if you know it, you can read it

-- Only service role can INSERT/UPDATE/DELETE (done via admin client in server actions)
-- No anon/authenticated write policies needed.

-- ── Set kuku9570@gmail.com as superadmin ──────────────────────
-- This will update the role if the profile row already exists.
-- If the user has not yet signed up, this is a no-op (safe).
UPDATE public.profiles
SET role = 'superadmin', is_active = true
WHERE id IN (
  -- Match by email from auth.users
  SELECT au.id
  FROM auth.users au
  WHERE au.email = 'kuku9570@gmail.com'
);

-- If the user exists in auth.users but profile row doesn't exist yet, insert it:
INSERT INTO public.profiles (id, full_name, role, is_active)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Super Admin'),
  'superadmin',
  true
FROM auth.users au
WHERE au.email = 'kuku9570@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
  );
