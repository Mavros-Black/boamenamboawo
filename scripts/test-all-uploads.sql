-- Test All Image Uploads Across the Application
-- Run this in your Supabase SQL Editor

-- 1. Check Blog Posts with Images
SELECT 
  'Blog Posts' as table_name,
  COUNT(*) as total_posts,
  COUNT(CASE WHEN image_url LIKE '%supabase.co%' THEN 1 END) as supabase_images,
  COUNT(CASE WHEN image_url LIKE '%picsum.photos%' THEN 1 END) as placeholder_images,
  COUNT(CASE WHEN image_url IS NULL OR image_url = '' THEN 1 END) as no_images
FROM blog_posts;

-- 2. Check Programs with Images
SELECT 
  'Programs' as table_name,
  COUNT(*) as total_programs,
  COUNT(CASE WHEN image_url LIKE '%supabase.co%' THEN 1 END) as supabase_images,
  COUNT(CASE WHEN image_url LIKE '%picsum.photos%' THEN 1 END) as placeholder_images,
  COUNT(CASE WHEN image_url IS NULL OR image_url = '' THEN 1 END) as no_images
FROM programs;

-- 3. Check Products with Images
SELECT 
  'Products' as table_name,
  COUNT(*) as total_products,
  COUNT(CASE WHEN image_url LIKE '%supabase.co%' THEN 1 END) as supabase_images,
  COUNT(CASE WHEN image_url LIKE '%picsum.photos%' THEN 1 END) as placeholder_images,
  COUNT(CASE WHEN image_url IS NULL OR image_url = '' THEN 1 END) as no_images
FROM products;

-- 4. Show Recent Blog Posts with Image URLs
SELECT 
  'Recent Blog Posts' as section,
  title,
  image_url,
  created_at,
  CASE 
    WHEN image_url LIKE '%supabase.co%' THEN '✅ Supabase Storage'
    WHEN image_url LIKE '%picsum.photos%' THEN '⚠️ Placeholder'
    WHEN image_url IS NULL OR image_url = '' THEN '❌ No Image'
    ELSE '❓ Other'
  END as image_status
FROM blog_posts 
ORDER BY created_at DESC
LIMIT 5;

-- 5. Show Recent Programs with Image URLs
SELECT 
  'Recent Programs' as section,
  title,
  image_url,
  created_at,
  CASE 
    WHEN image_url LIKE '%supabase.co%' THEN '✅ Supabase Storage'
    WHEN image_url LIKE '%picsum.photos%' THEN '⚠️ Placeholder'
    WHEN image_url IS NULL OR image_url = '' THEN '❌ No Image'
    ELSE '❓ Other'
  END as image_status
FROM programs 
ORDER BY created_at DESC
LIMIT 5;

-- 6. Show Recent Products with Image URLs
SELECT 
  'Recent Products' as section,
  name as title,
  image_url,
  created_at,
  CASE 
    WHEN image_url LIKE '%supabase.co%' THEN '✅ Supabase Storage'
    WHEN image_url LIKE '%picsum.photos%' THEN '⚠️ Placeholder'
    WHEN image_url IS NULL OR image_url = '' THEN '❌ No Image'
    ELSE '❓ Other'
  END as image_status
FROM products 
ORDER BY created_at DESC
LIMIT 5;

-- 7. Check Storage Bucket Contents
SELECT 
  'Storage Bucket Contents' as section,
  bucket_id,
  COUNT(*) as file_count,
  MIN(created_at) as oldest_file,
  MAX(created_at) as newest_file
FROM storage.objects 
WHERE bucket_id = 'images'
GROUP BY bucket_id;

-- 8. Check Storage Files by Folder
SELECT 
  'Files by Folder' as section,
  SPLIT_PART(name, '/', 1) as folder,
  COUNT(*) as file_count,
  MIN(created_at) as oldest_file,
  MAX(created_at) as newest_file
FROM storage.objects 
WHERE bucket_id = 'images'
GROUP BY SPLIT_PART(name, '/', 1)
ORDER BY folder;
