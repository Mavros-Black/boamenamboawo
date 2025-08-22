-- Fix Storage RLS Policy - More Permissive
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what policies exist
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

-- 2. Drop ALL existing policies on storage.objects
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for users based on email" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Access" ON storage.objects;

-- 3. Create a very permissive policy for testing
CREATE POLICY "Allow all operations for images bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'images');

-- 4. Alternative: Disable RLS temporarily for testing
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 5. Verify the bucket exists and is public
SELECT * FROM storage.buckets WHERE id = 'images';

-- 6. Show the new policies
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

-- 7. Test insert (optional - remove after testing)
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata)
-- VALUES (
--   'images',
--   'test-file.txt',
--   auth.uid(),
--   '{"mimetype": "text/plain", "size": 0}'::jsonb
-- ) ON CONFLICT DO NOTHING;
