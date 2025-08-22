-- Debug Storage Upload Issues
-- Run this in your Supabase SQL Editor

-- 1. Check if the images bucket exists
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'images';

-- 2. Check RLS policies on storage.objects
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- 3. Check if RLS is enabled on storage.objects
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- 4. List any existing files in the images bucket
SELECT 
  name,
  bucket_id,
  owner,
  metadata,
  created_at
FROM storage.objects 
WHERE bucket_id = 'images'
ORDER BY created_at DESC
LIMIT 10;

-- 5. Test if we can insert a test record (this will help verify permissions)
-- Note: This is just for testing, you can remove this after confirming it works
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES (
  'images',
  'test-debug-file.txt',
  auth.uid(),
  '{"mimetype": "text/plain", "size": 0}'::jsonb
) ON CONFLICT DO NOTHING;

-- 6. Show the test record
SELECT 
  name,
  bucket_id,
  owner,
  metadata,
  created_at
FROM storage.objects 
WHERE bucket_id = 'images' AND name = 'test-debug-file.txt';

-- 7. Clean up test file
DELETE FROM storage.objects WHERE bucket_id = 'images' AND name = 'test-debug-file.txt';
