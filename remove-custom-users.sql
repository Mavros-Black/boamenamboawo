-- Remove custom users table and rely solely on Supabase Auth
-- This script removes the public.users table and all related triggers

-- Drop any existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop the custom users table completely
DROP TABLE IF EXISTS public.users CASCADE;

-- Show that we only have auth.users now
SELECT 
    'auth.users count' as table_name,
    COUNT(*) as count
FROM auth.users;

-- Show all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
