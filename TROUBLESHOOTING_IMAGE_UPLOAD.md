# 🔧 Image Upload Troubleshooting Guide

## 🚨 **Current Issues**
- Blog images not updating
- Database storage showing empty
- Images not appearing in public pages

## 🔍 **Step-by-Step Debugging**

### **Step 1: Check Supabase Storage Setup**

1. **Go to your Supabase Dashboard**
2. **Navigate to Storage** in the left sidebar
3. **Check if "images" bucket exists**
   - If not, create it with these settings:
     - Name: `images`
     - Public bucket: ✅ Checked
     - File size limit: 5MB
     - Allowed MIME types: `image/*`

### **Step 2: Run Database Schema Update**

1. **Go to Supabase Dashboard > SQL Editor**
2. **Copy and paste the contents of `database-schema-update.sql`**
3. **Run the script**
4. **Check the output for any errors**

### **Step 3: Test Storage Setup**

1. **Visit `/test-storage` in your app**
2. **Click "Test Storage" button**
3. **Check if the test passes**
4. **If it fails, follow the error message**

### **Step 4: Check Environment Variables**

Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Step 5: Test Image Upload**

1. **Login as admin**
2. **Go to Dashboard > Blog**
3. **Create a new blog post**
4. **Upload an image**
5. **Check browser console for debug logs**
6. **Check Network tab for API calls**

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Upload failed" Error**

**Symptoms:**
- Image upload fails with error message
- No image appears in form

**Solutions:**
1. **Check Supabase Storage bucket exists**
2. **Verify bucket is public**
3. **Check RLS policies are set correctly**
4. **Ensure environment variables are correct**

### **Issue 2: Images not saving to database**

**Symptoms:**
- Upload succeeds but image_url is empty in database
- Images don't appear in public pages

**Solutions:**
1. **Run database schema update script**
2. **Check if `image_url` column exists in tables**
3. **Verify API is receiving image_url in request**
4. **Check browser console for debug logs**

### **Issue 3: Images not displaying**

**Symptoms:**
- Images saved to database but not showing
- Broken image links

**Solutions:**
1. **Check if bucket is public**
2. **Verify RLS policies allow public read**
3. **Check image URLs in browser console**
4. **Test direct image URL access**

### **Issue 4: Database showing empty**

**Symptoms:**
- No data in Supabase tables
- API returning empty results

**Solutions:**
1. **Check if tables exist**
2. **Verify RLS policies allow access**
3. **Check if data is being inserted**
4. **Look for API errors in console**

## 🔧 **Debug Commands**

### **Check Database Tables:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('blog_posts', 'programs');

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;
```

### **Check Storage Buckets:**
```sql
-- List storage buckets
SELECT * FROM storage.buckets;

-- Check storage policies
SELECT * FROM storage.policies;
```

### **Check RLS Policies:**
```sql
-- Check blog_posts policies
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';

-- Check programs policies
SELECT * FROM pg_policies WHERE tablename = 'programs';
```

## 📊 **Debug Logs to Check**

### **Browser Console:**
1. **Image upload logs:**
   - "Image upload started: [filename]"
   - "Uploading to Supabase Storage..."
   - "Upload response status: [status]"
   - "Upload successful, URL: [url]"

2. **Form submission logs:**
   - "Submitting blog post with data: [data]"

### **Server Console:**
1. **API logs:**
   - "Blog POST request body: [body]"
   - "Blog post to insert: [data]"
   - "Blog post created successfully: [result]"

## 🛠️ **Quick Fixes**

### **If Storage Bucket Missing:**
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;
```

### **If Tables Missing:**
Run the complete `database-schema-update.sql` script.

### **If RLS Policies Missing:**
```sql
-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admin full access for blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

## 🧪 **Testing Checklist**

- [ ] Supabase Storage bucket exists and is public
- [ ] Database tables have `image_url` columns
- [ ] RLS policies are configured correctly
- [ ] Environment variables are set
- [ ] Storage test page passes
- [ ] Image upload works in blog form
- [ ] Images appear in program cards
- [ ] Images show in public pages

## 📞 **Next Steps**

1. **Run the test storage page** (`/test-storage`)
2. **Check browser console** for debug logs
3. **Verify database schema** is updated
4. **Test image upload** in blog form
5. **Check if images appear** in public pages

---

**If you're still having issues, please share:**
- Error messages from browser console
- Error messages from server console
- Results from `/test-storage` page
- Database table structure
