-- Fix Blog Post Images
-- Run this in your Supabase SQL Editor

-- Update existing blog posts that have via.placeholder.com URLs
UPDATE blog_posts 
SET image_url = 'https://picsum.photos/400/300?random=' || extract(epoch from now())::text
WHERE image_url LIKE '%via.placeholder.com%';

-- Update blog posts with empty image_url to have a placeholder
UPDATE blog_posts 
SET image_url = 'https://picsum.photos/400/300?random=' || extract(epoch from now())::text
WHERE image_url IS NULL OR image_url = '';

-- Show the updated blog posts
SELECT 
  id,
  title,
  status,
  image_url,
  created_at
FROM blog_posts 
ORDER BY created_at DESC;
