#!/usr/bin/env node

// Script to test image upload functionality
console.log('🔧 Testing image upload functionality...\n');

const testUpload = `
To test if image uploads are working:

1. Go to your dashboard: /dashboard/programs
2. Create a new program with an image
3. Check if the image URL is saved in the database
4. Verify the image displays on the public programs page: /programs

If images are not displaying:

1. Check browser console for errors
2. Verify the image URL is accessible by opening it directly in a new tab
3. Ensure the Supabase storage bucket 'images' exists and has public read access
4. Check that the storage policies allow public read access:

   CREATE POLICY "Public read access for images" ON storage.objects
     FOR SELECT USING (bucket_id = 'images');
`;

console.log(testUpload);