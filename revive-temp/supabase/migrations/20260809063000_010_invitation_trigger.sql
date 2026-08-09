-- ============================================================
-- Run this in: Supabase Dashboard → SQL Editor
-- Creates a trigger that fires on EVERY new user signup
-- (email/password, Google, any OAuth) and auto-assigns the
-- invited role if the email matches a pending invitation.
-- ============================================================

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_invitation_on_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite  RECORD;
  v_name    TEXT;
BEGIN
  -- Find a non-expired pending invitation for this email
  SELECT id, role
  INTO   v_invite
  FROM   public.staff_invitations
  WHERE  LOWER(email) = LOWER(NEW.email)
    AND  status       = 'pending'
    AND  expires_at   > NOW()
  LIMIT 1;

  -- No invitation found → nothing to do
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  -- Resolve display name from OAuth metadata or email prefix
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Upsert profile with the invited role
  INSERT INTO public.profiles (id, full_name, role, is_active)
  VALUES (NEW.id, v_name, v_invite.role, true)
  ON CONFLICT (id) DO UPDATE
    SET role      = EXCLUDED.role,
        is_active = true,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

  -- Mark invitation accepted
  UPDATE public.staff_invitations
  SET    status      = 'accepted',
         accepted_at = NOW()
  WHERE  id = v_invite.id;

  RETURN NEW;
END;
$$;

-- Step 2: Drop old trigger if it exists, then create fresh
DROP TRIGGER IF EXISTS on_auth_user_created_check_invitation ON auth.users;

CREATE TRIGGER on_auth_user_created_check_invitation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_invitation_on_auth();

-- Step 3: Verify
SELECT trigger_name, event_manipulation, event_object_table
FROM   information_schema.triggers
WHERE  trigger_name = 'on_auth_user_created_check_invitation';

-- Expected result: 1 row with trigger_name = 'on_auth_user_created_check_invitation'
