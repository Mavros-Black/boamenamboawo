#!/usr/bin/env node

// Script to check programs data and image URLs
console.log('🔧 Checking programs data...\n');

const checkPrograms = `
To check if programs have valid image URLs:

1. Go to your Supabase Dashboard
2. Navigate to Table Editor
3. Select the 'programs' table
4. Check if the 'image_url' column contains valid URLs
5. Test a few URLs by opening them in a browser

If image URLs are missing or invalid:

1. Check if images were uploaded successfully during program creation
2. Verify the upload endpoint (/api/upload) is working
3. Check browser network tab for upload errors
4. Ensure the storage bucket 'images' exists and is public
`;

console.log(checkPrograms);