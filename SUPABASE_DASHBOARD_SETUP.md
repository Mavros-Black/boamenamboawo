# Supabase Dashboard Storage Setup

## **Method 1: Using Supabase Dashboard (Recommended)**

### **Step 1: Create Storage Bucket**
1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"Create a new bucket"**
4. Fill in the details:
   - **Name**: `images`
   - **Public bucket**: ✅ Check this box
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp, image/svg+xml`
5. Click **"Create bucket"**

### **Step 2: Set Up RLS Policies**
1. In the Storage section, click on the `images` bucket
2. Go to the **"Policies"** tab
3. Click **"New Policy"**
4. Choose **"Create a policy from scratch"**
5. Fill in the details:
   - **Policy name**: `Simple images access`
   - **Allowed operation**: `ALL`
   - **Target roles**: `authenticated`
   - **Using expression**: `bucket_id = 'images'`
6. Click **"Review"** then **"Save policy"**

### **Step 3: Test the Setup**
1. Go to your app and visit `/test-storage-upload`
2. Try uploading an image
3. Check if it works without RLS errors

## **Method 2: Using SQL (Alternative)**

If the dashboard method doesn't work, try this SQL:

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create simple policy
CREATE POLICY "Simple images access" ON storage.objects
  FOR ALL USING (bucket_id = 'images');
```

## **Troubleshooting**

### **If you still get RLS errors:**
1. Check if you're logged in as an admin user
2. Verify the bucket exists in Storage section
3. Check that the policy was created correctly
4. Try uploading a smaller image (< 1MB)

### **If bucket creation fails:**
1. Make sure you have the correct permissions
2. Try creating the bucket with a different name
3. Check if there are any existing buckets with the same name

### **If upload still fails:**
1. Check the browser console for detailed error messages
2. Visit `/api/test-storage` to see storage configuration
3. Verify your environment variables are correct
