# 📁 Supabase Storage Setup Guide

## Overview

This guide will help you set up Supabase Storage for image uploads in your Boa Me Youth Empowerment website. Supabase Storage provides secure, scalable file storage with CDN distribution.

## Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**
2. **Navigate to Storage** in the left sidebar
3. **Click "Create a new bucket"**
4. **Configure the bucket:**
   - **Name:** `images`
   - **Public bucket:** ✅ Check this (for public image access)
   - **File size limit:** 5MB (or your preferred limit)
   - **Allowed MIME types:** `image/*`

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

### For Public Read Access (Recommended for images):

```sql
-- Allow public read access to images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects 
FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects 
FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Alternative: Simple Public Upload (Less Secure):

```sql
-- Allow public uploads (use with caution)
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
```

## Step 3: Test the Setup

1. **Start your development server:** `npm run dev`
2. **Login as admin** and go to Dashboard > Programs
3. **Try creating a program** with an image upload
4. **Check the Supabase Storage dashboard** to see if the image was uploaded

## Step 4: Environment Variables

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Folder Structure

The storage will organize images in folders:

```
images/
├── programs/     # Program images
├── blog/         # Blog post images
├── products/     # Product images (if needed)
└── uploads/      # General uploads
```

## Features Implemented

✅ **Image Upload:** Drag & drop or click to upload
✅ **File Validation:** Type and size checks
✅ **Progress Indicator:** Upload progress display
✅ **Error Handling:** User-friendly error messages
✅ **Image Preview:** Preview before upload
✅ **Public URLs:** Images accessible via public URLs

## API Endpoints

- **POST** `/api/upload` - Upload images to Supabase Storage
- **Parameters:**
  - `file`: The image file
  - `bucket`: Storage bucket name (default: 'images')
  - `folder`: Folder within bucket (default: 'uploads')

## Usage Examples

### Programs Form:
- Images are uploaded to `images/programs/` folder
- Used for program thumbnails and featured images

### Blog Form:
- Images are uploaded to `images/blog/` folder
- Used for blog post featured images

## Troubleshooting

### Common Issues:

1. **"Upload failed" Error:**
   - Check if Supabase is configured
   - Verify storage bucket exists
   - Check RLS policies are set correctly

2. **"File size too large" Error:**
   - Increase file size limit in bucket settings
   - Or compress the image before upload

3. **"Invalid file type" Error:**
   - Check MIME type restrictions in bucket settings
   - Ensure file is actually an image

4. **Images not displaying:**
   - Check if bucket is public
   - Verify RLS policies allow public read access
   - Check image URL in browser console

### Debug Steps:

1. **Check Supabase Dashboard:**
   - Go to Storage > images bucket
   - Verify files are being uploaded

2. **Check Browser Console:**
   - Look for upload errors
   - Check network requests to `/api/upload`

3. **Test with Simple Image:**
   - Try uploading a small JPEG file
   - Check if it appears in storage

## Security Considerations

- **Public Bucket:** Images are publicly accessible
- **File Validation:** Server-side validation prevents malicious uploads
- **Size Limits:** Prevents abuse with large files
- **Type Restrictions:** Only allows image files

## Next Steps

1. **Set up image optimization** (optional)
2. **Add image compression** (optional)
3. **Implement image deletion** when programs/blog posts are deleted
4. **Add image resizing** for thumbnails

---

**Your image upload functionality is now ready! 🎉**

Try creating a program or blog post with an image to test the setup.
