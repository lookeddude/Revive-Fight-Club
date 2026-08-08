-- ============================================================
-- MIGRATION 008: Storage Buckets & Policies
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('revive-trainers',   'revive-trainers',   true,  5242880,  ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('revive-programs',   'revive-programs',   true,  5242880,  ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('revive-gallery',    'revive-gallery',    true,  10485760, ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('revive-facilities', 'revive-facilities', true,  10485760, ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('revive-brand',      'revive-brand',      true,  5242880,  ARRAY['image/jpeg','image/png','image/webp','image/avif','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_revive_trainers"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'revive-trainers');

CREATE POLICY "auth_write_revive_trainers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'revive-trainers');

CREATE POLICY "auth_update_revive_trainers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'revive-trainers');

CREATE POLICY "auth_delete_revive_trainers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'revive-trainers');

CREATE POLICY "public_read_revive_programs"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'revive-programs');

CREATE POLICY "auth_write_revive_programs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'revive-programs');

CREATE POLICY "auth_update_revive_programs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'revive-programs');

CREATE POLICY "auth_delete_revive_programs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'revive-programs');

CREATE POLICY "public_read_revive_gallery"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'revive-gallery');

CREATE POLICY "auth_write_revive_gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'revive-gallery');

CREATE POLICY "auth_update_revive_gallery"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'revive-gallery');

CREATE POLICY "auth_delete_revive_gallery"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'revive-gallery');

CREATE POLICY "public_read_revive_facilities"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'revive-facilities');

CREATE POLICY "auth_write_revive_facilities"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'revive-facilities');

CREATE POLICY "auth_update_revive_facilities"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'revive-facilities');

CREATE POLICY "auth_delete_revive_facilities"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'revive-facilities');

CREATE POLICY "public_read_revive_brand"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'revive-brand');

CREATE POLICY "auth_write_revive_brand"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'revive-brand');

CREATE POLICY "auth_update_revive_brand"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'revive-brand');

CREATE POLICY "auth_delete_revive_brand"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'revive-brand');
