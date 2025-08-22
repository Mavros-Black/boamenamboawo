-- Temporarily Disable Storage RLS for Testing
-- Run this in your Supabase SQL Editor

-- 1. Disable RLS on storage.objects table
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 2. Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- 3. Show that no policies are active
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 4. Verify bucket exists
SELECT * FROM storage.buckets WHERE id = 'images';

-- IMPORTANT: After testing, re-enable RLS with proper policies:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- Then run the proper RLS policies from fix-storage-rls.sql
