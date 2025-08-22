-- Setup Storage Bucket and RLS Policies
-- Run this in your Supabase SQL Editor

-- 1. Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- 2. Drop any existing RLS policies on storage.objects
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- 3. Create new RLS policies for storage.objects
-- Allow public read access to all images
CREATE POLICY "Public read access for images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update images
CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete images
CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
  );

-- 4. Verify the bucket exists
SELECT * FROM storage.buckets WHERE id = 'images';

-- 5. Show the RLS policies
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

-- 6. Test if we can insert a test record (this will help verify permissions)
-- Note: This is just for testing, you can remove this after confirming it works
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
VALUES (
  'images',
  'test-file.txt',
  auth.uid(),
  '{"mimetype": "text/plain", "size": 0}'::jsonb
) ON CONFLICT DO NOTHING;

-- 7. Clean up test file
DELETE FROM storage.objects WHERE bucket_id = 'images' AND name = 'test-file.txt';
