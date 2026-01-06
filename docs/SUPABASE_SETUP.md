# Supabase Setup Guide

## Environment Variables Required

### For Client-Side (Public)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For Server-Side (Private - Required for Admin Operations)
```env
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## How to Get Your Service Role Key

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project

### 2. Navigate to Settings
- Click on "Settings" in the left sidebar
- Click on "API" tab

### 3. Copy the Service Role Key
- Find the "service_role" key (NOT the anon key)
- Copy this key
- **⚠️ Keep this secret - never expose it in client-side code**

### 4. Add to Environment Variables
- Add `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key` to your `.env.local` file
- For production, add it to your hosting platform's environment variables

## What Each Key Does

### Anon Key (Public)
- Used for client-side operations
- Limited permissions
- Safe to expose in browser

### Service Role Key (Private)
- Used for server-side operations
- Full admin permissions
- Can access all data and perform admin operations
- **NEVER expose in client-side code**

## Admin Operations That Require Service Role Key

- `supabase.auth.admin.listUsers()` - List all users
- `supabase.auth.admin.updateUserById()` - Update user metadata
- `supabase.auth.admin.getUserById()` - Get specific user
- `supabase.auth.admin.deleteUser()` - Delete user

## Troubleshooting

### "Failed to find user" Error
This usually means the service role key is missing or incorrect.

1. Check if `SUPABASE_SERVICE_ROLE_KEY` is set in your environment
2. Verify the key is correct in Supabase dashboard
3. Restart your development server after adding the key

### "Insufficient permissions" Error
This means you're using the anon key for admin operations.

1. Make sure you're using `supabaseAdmin` for server-side operations
2. Check that the service role key is properly configured

## Security Notes

- ✅ Use anon key for client-side operations
- ✅ Use service role key for server-side operations only
- ❌ Never expose service role key in client-side code
- ❌ Never commit service role key to version control
