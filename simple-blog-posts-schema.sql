-- Simple Blog Posts Schema (No Foreign Key Constraints)
-- Run this in your Supabase SQL Editor

-- Drop the existing table if it exists
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Create a simple blog_posts table without foreign key constraints
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author_id TEXT, -- Just a text field, no foreign key
    category TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
DROP POLICY IF EXISTS "Public read access for blog posts" ON blog_posts;
CREATE POLICY "Public read access for blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access for blog posts" ON blog_posts;
CREATE POLICY "Admin full access for blog posts" ON blog_posts
    FOR ALL USING (true); -- Allow all operations for now

-- Show the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;
