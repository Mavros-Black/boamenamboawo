-- SQL commands to make specific users admin/superadmin
-- Run these commands in your Supabase SQL Editor

-- Update user metadata to set admin role for mavros.black@yahoo.com
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'mavros.black@yahoo.com';

-- Update user metadata to set admin role for boamenameboawo@gmail.com  
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'boamenameboawo@gmail.com';

-- Verify the changes
SELECT 
    email, 
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'name' as name,
    created_at
FROM auth.users 
WHERE email IN ('mavros.black@yahoo.com', 'boamenameboawo@gmail.com');

-- Alternative: If you want to ensure the name is also set properly
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    '{"role": "admin", "name": "Mavros Admin"}'::jsonb
WHERE email = 'mavros.black@yahoo.com';

UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    '{"role": "admin", "name": "Boa Me Admin"}'::jsonb
WHERE email = 'boamenameboawo@gmail.com';

-- Final verification query
SELECT 
    id,
    email, 
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'name' as name,
    email_confirmed_at,
    created_at,
    updated_at
FROM auth.users 
WHERE email IN ('mavros.black@yahoo.com', 'boamenameboawo@gmail.com')
ORDER BY created_at;