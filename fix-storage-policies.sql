-- Fix Storage RLS Policies for Image Upload
-- Run this in your Supabase SQL Editor

-- First, let's check current storage policies
SELECT * FROM storage.policies WHERE table_name = 'objects';

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;

-- Create the correct storage policies for public read and authenticated upload
-- Policy 1: Allow public read access to all files in the images bucket
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Policy 2: Allow authenticated users to upload files to the images bucket
CREATE POLICY "Authenticated upload for images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated update for images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated delete for images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Verify the images bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/*'];

-- Show the updated policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- Test if the bucket is accessible
SELECT * FROM storage.buckets WHERE id = 'images';
