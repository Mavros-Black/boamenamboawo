#!/usr/bin/env node

// Script to check and fix storage setup for program images
console.log('🔧 Checking storage setup for program images...\n');

const storageSetupSQL = `
-- Check if images bucket exists
SELECT * FROM storage.buckets WHERE id = 'images';

-- Check storage policies for images
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
WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname LIKE '%image%';

-- If no policies exist, create them:
-- CREATE POLICY "Public read access for images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'images');
-- 
-- CREATE POLICY "Authenticated users can upload images" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'images' 
--     AND auth.role() = 'authenticated'
--   );
`;

console.log('Run this SQL in your Supabase SQL Editor to check storage setup:\n');
console.log(storageSetupSQL);

console.log('\n✅ If images are still not showing, try these steps:');
console.log('1. Check if the images bucket exists in Supabase Storage');
console.log('2. Verify that the bucket has public read access');
console.log('3. Ensure the image URLs in the database are correct');
console.log('4. Test accessing an image URL directly in your browser');