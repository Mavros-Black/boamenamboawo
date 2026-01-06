# Test User Registration with Supabase Auth

## Steps to Test:

### 1. Run the SQL Scripts
First, run these scripts in your Supabase SQL Editor:

1. **`remove-custom-users.sql`** - Removes custom users table
2. **`create-orders-table-safe.sql`** - Creates orders table safely

### 2. Test User Registration
1. Go to `/auth/register`
2. Fill in the registration form:
   - Name: "Test User"
   - Email: "test@example.com" (or any email)
   - Password: "test123456"
3. Click "Register"

### 3. Expected Results:
- ✅ User should be created in `auth.users` (Supabase Auth)
- ✅ User should be redirected to dashboard
- ✅ No database errors should occur
- ✅ User metadata should contain name and role

### 4. Verify in Supabase Dashboard:
1. Go to Supabase Dashboard → Authentication → Users
2. You should see the new user listed
3. Check that user metadata contains:
   ```json
   {
     "name": "Test User",
     "role": "user"
   }
   ```

### 5. Test Login:
1. Go to `/auth/login`
2. Use the same email and password
3. Should login successfully

## What Should Work:
- ✅ User registration without database errors
- ✅ User login without database errors
- ✅ Dashboard access based on user role
- ✅ Orders creation and management
- ✅ All existing functionality

## What's Different:
- ❌ No custom `public.users` table
- ✅ Users stored only in `auth.users` (Supabase Auth)
- ✅ User roles stored in `user_metadata`
- ✅ Simpler, more secure authentication
