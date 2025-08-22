-- Verify Database Setup for User Registration
-- Run this script to check if everything is set up correctly

-- 1. Check if public.users table exists (should NOT exist)
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') 
        THEN '❌ public.users table still exists - run remove-custom-users.sql'
        ELSE '✅ public.users table removed correctly'
    END as users_table_status;

-- 2. Check auth.users table (should exist and contain users)
SELECT 
    'auth.users table' as table_name,
    COUNT(*) as user_count
FROM auth.users;

-- 3. Check if orders table exists and is properly configured
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders' AND table_schema = 'public') 
        THEN '✅ public.orders table exists'
        ELSE '❌ public.orders table missing - run create-orders-table-safe.sql'
    END as orders_table_status;

-- 4. Check orders table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Check RLS policies on orders table
SELECT 
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'orders' AND schemaname = 'public';

-- 6. Check products table (should exist)
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products' AND table_schema = 'public') 
        THEN '✅ public.products table exists'
        ELSE '❌ public.products table missing'
    END as products_table_status;

-- 7. Check products with broken images
SELECT 
    id,
    name,
    image_url,
    CASE 
        WHEN image_url LIKE '/images/%' THEN '❌ Broken image URL'
        WHEN image_url IS NULL OR image_url = '' THEN '⚠️ No image'
        ELSE '✅ Valid image URL'
    END as image_status
FROM products 
ORDER BY created_at DESC;

-- 8. Show recent auth.users (last 5)
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 9. Check if any triggers exist on auth.users (should NOT exist)
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' AND event_object_schema = 'auth';
