-- Database Schema Update for Image Upload Support
-- Run this in your Supabase SQL Editor

-- Check if blog_posts table exists and add image_url column if missing
DO $$ 
BEGIN
    -- Add image_url column to blog_posts table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to blog_posts table';
    ELSE
        RAISE NOTICE 'image_url column already exists in blog_posts table';
    END IF;
END $$;

-- Check if programs table exists and add image_url column if missing
DO $$ 
BEGIN
    -- Add image_url column to programs table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'programs' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE programs ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to programs table';
    ELSE
        RAISE NOTICE 'image_url column already exists in programs table';
    END IF;
END $$;

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create programs table if it doesn't exist
CREATE TABLE IF NOT EXISTS programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'General',
    status TEXT CHECK (status IN ('active', 'inactive', 'completed')) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    location TEXT,
    max_participants INTEGER DEFAULT 0,
    current_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog_posts
DROP POLICY IF EXISTS "Public read access for blog posts" ON blog_posts;
CREATE POLICY "Public read access for blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access for blog posts" ON blog_posts;
CREATE POLICY "Admin full access for blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for programs
DROP POLICY IF EXISTS "Public read access for programs" ON programs;
CREATE POLICY "Public read access for programs" ON programs
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access for programs" ON programs;
CREATE POLICY "Admin full access for programs" ON programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Show current table structure
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('blog_posts', 'programs')
ORDER BY table_name, ordinal_position;
