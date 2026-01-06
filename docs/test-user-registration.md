# Test User Registration - Complete Guide

## 🔧 **Step 1: Run Required SQL Scripts**

### **First, run these scripts in Supabase SQL Editor:**

1. **`remove-custom-users.sql`** - Removes custom users table
2. **`create-orders-table-safe.sql`** - Creates orders table safely
3. **`fix-product-images.sql`** - Fixes broken product images

## 🧪 **Step 2: Test User Registration**

### **Test Case 1: New User Registration**
1. Go to `/auth/register`
2. Fill in the form:
   - **Name**: "Test User"
   - **Email**: "test@example.com" (or any email)
   - **Password**: "test123456"
3. Click "Register"

### **Expected Results:**
- ✅ User should be created in `auth.users` (Supabase Auth)
- ✅ User should be redirected to dashboard
- ✅ No database errors should occur
- ✅ User metadata should contain name and role

### **Test Case 2: Verify in Supabase Dashboard**
1. Go to Supabase Dashboard → Authentication → Users
2. You should see the new user listed
3. Check that user metadata contains:
   ```json
   {
     "name": "Test User",
     "role": "user"
   }
   ```

### **Test Case 3: Test Login**
1. Go to `/auth/login`
2. Use the same email and password
3. Should login successfully

## 🔍 **Step 3: Debugging Steps**

### **If Registration Fails:**

1. **Check Browser Console** for errors
2. **Check Terminal** for server errors
3. **Check Supabase Dashboard** → Authentication → Users
4. **Check Supabase Logs** → Database → Logs

### **Common Issues:**

1. **"Invalid login credentials"** - User not created properly
2. **"Database error"** - SQL scripts not run
3. **"Redirect loop"** - Auth state issues

## 📊 **Step 4: Verify Database State**

### **Run these queries in Supabase SQL Editor:**

```sql
-- Check auth.users
SELECT id, email, raw_user_meta_data, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Check if public.users table exists (should be empty or not exist)
SELECT COUNT(*) FROM public.users;

-- Check orders table
SELECT COUNT(*) FROM public.orders;
```

## 🎯 **Expected Database State:**

- ✅ **`auth.users`** - Contains all registered users
- ✅ **`public.users`** - Should NOT exist (removed)
- ✅ **`public.orders`** - Should exist and be empty initially

## 🚀 **Step 5: Test Complete Flow**

1. **Register** → Should work without errors
2. **Login** → Should work without errors  
3. **Dashboard** → Should show user info
4. **Shop** → Should work for guest and logged-in users
5. **Checkout** → Should require login
6. **Payment** → Should create orders in database

## 📝 **Step 6: Logs to Check**

### **Browser Console:**
- Registration success/error messages
- Auth state changes
- Redirect messages

### **Terminal:**
- API route errors
- Database connection issues
- Supabase client errors

## 🔧 **Troubleshooting**

### **If Still Having Issues:**

1. **Clear browser cache and localStorage**
2. **Restart the development server**
3. **Check environment variables**
4. **Verify Supabase project settings**

### **Environment Variables to Check:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
