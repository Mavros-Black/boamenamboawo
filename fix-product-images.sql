-- Fix product images by updating them with proper placeholder URLs
-- This script updates existing products that have broken image URLs

-- Update products with proper placeholder images
UPDATE products 
SET image_url = 'https://picsum.photos/400/300?random=1&blur=2'
WHERE image_url = '/images/products/tshirt.jpg';

UPDATE products 
SET image_url = 'https://picsum.photos/400/300?random=2&blur=2'
WHERE image_url = '/images/products/hoodie.jpg';

UPDATE products 
SET image_url = 'https://picsum.photos/400/300?random=3&blur=2'
WHERE image_url = '/images/products/education.jpg';

UPDATE products 
SET image_url = 'https://picsum.photos/400/300?random=4&blur=2'
WHERE image_url = '/images/products/healthcare.jpg';

-- Show updated products
SELECT id, name, image_url, category 
FROM products 
ORDER BY created_at DESC;

-- Show products that still have broken URLs
SELECT id, name, image_url 
FROM products 
WHERE image_url LIKE '/images/%';
