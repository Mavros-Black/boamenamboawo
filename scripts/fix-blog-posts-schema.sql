-- Fix Blog Posts Foreign Key Constraint
-- Run this in your Supabase SQL Editor

-- First, let's check the current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name = 'author_id';

-- Drop the existing foreign key constraint if it exists
ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;

-- Make sure author_id is nullable
ALTER TABLE blog_posts ALTER COLUMN author_id DROP NOT NULL;

-- Add a proper foreign key constraint that allows NULL values
ALTER TABLE blog_posts 
ADD CONSTRAINT blog_posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update the table structure to ensure proper defaults
ALTER TABLE blog_posts 
ALTER COLUMN author_id SET DEFAULT NULL;

-- Show the updated table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name = 'author_id';

-- Show the foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'blog_posts';
