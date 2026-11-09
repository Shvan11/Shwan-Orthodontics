-- Make the public anon key read-only.
--
-- NEXT_PUBLIC_SUPABASE_ANON_KEY is shipped to every browser. With the original
-- "Allow all operations" policies in schema.sql, anyone holding that key could
-- write the `content` table straight through Supabase's REST API, skipping the
-- admin password entirely. After this script, only the service-role key (used
-- server-side by lib/supabaseServer.ts, which bypasses RLS) can write.
--
-- Run it in the Supabase SQL Editor only AFTER:
--   1. SUPABASE_SERVICE_ROLE_KEY is set in Vercel, and
--   2. the build that uses it is deployed.
-- Otherwise saving from /admin-supabase fails until both are done.

-- 0. (Optional) See which policies exist now. Live policy names may differ from
--    the ones dropped below; drop any other write policy you find as well.
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN ('content', 'gallery_images'))
   OR (schemaname = 'storage' AND tablename = 'objects');

-- 1. Content tables: public read, no public write.
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on content" ON content;
DROP POLICY IF EXISTS "Allow all operations on gallery_images" ON gallery_images;

DROP POLICY IF EXISTS "Public read access on content" ON content;
CREATE POLICY "Public read access on content" ON content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access on gallery_images" ON gallery_images;
CREATE POLICY "Public read access on gallery_images" ON gallery_images
  FOR SELECT USING (true);

-- 2. Storage bucket: keep public reads, remove anonymous upload/update/delete.
DROP POLICY IF EXISTS "Anyone can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete gallery images" ON storage.objects;
