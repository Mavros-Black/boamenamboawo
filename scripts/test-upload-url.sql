-- Check for blog posts with actual Supabase storage URLs
-- Run this in your Supabase SQL Editor

-- Find posts with Supabase storage URLs
SELECT 
  id,
  title,
  image_url,
  created_at,
  CASE 
    WHEN image_url LIKE '%supabase.co%' THEN 'Supabase Storage'
    WHEN image_url LIKE '%picsum.photos%' THEN 'Placeholder'
    WHEN image_url LIKE '%via.placeholder.com%' THEN 'Old Placeholder'
    WHEN image_url IS NULL OR image_url = '' THEN 'No Image'
    ELSE 'Other'
  END as url_type
FROM blog_posts 
ORDER BY created_at DESC;

-- Count by URL type
SELECT 
  CASE 
    WHEN image_url LIKE '%supabase.co%' THEN 'Supabase Storage'
    WHEN image_url LIKE '%picsum.photos%' THEN 'Placeholder'
    WHEN image_url LIKE '%via.placeholder.com%' THEN 'Old Placeholder'
    WHEN image_url IS NULL OR image_url = '' THEN 'No Image'
    ELSE 'Other'
  END as url_type,
  COUNT(*) as count
FROM blog_posts 
GROUP BY url_type
ORDER BY count DESC;

-- Show the most recent posts
SELECT 
  id,
  title,
  image_url,
  created_at
FROM blog_posts 
ORDER BY created_at DESC
LIMIT 5;
