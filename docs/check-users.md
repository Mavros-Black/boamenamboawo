# Checking Users in Supabase Auth

## Issue: Users registering but not appearing in Supabase Auth

### Possible Causes:

1. **Email Confirmation Required**: By default, Supabase requires email confirmation before users appear as "confirmed" in the Auth dashboard.

2. **Wrong Dashboard Section**: Make sure you're looking in the correct place.

### How to Check Users in Supabase:

#### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project

#### 2. Navigate to Authentication
- Click on "Authentication" in the left sidebar
- Click on "Users" tab

#### 3. Check Different User States
- **All Users**: Shows all registered users (confirmed and unconfirmed)
- **Confirmed Users**: Shows only users who have confirmed their email
- **Unconfirmed Users**: Shows users who haven't confirmed their email yet

### What You Should See:

#### If Email Confirmation is Enabled (Default):
- New users will appear in "All Users" but marked as "Unconfirmed"
- They won't appear in "Confirmed Users" until they click the email confirmation link
- Check your email for confirmation links

#### If Email Confirmation is Disabled:
- Users should appear immediately in "Confirmed Users"
- They should be able to log in right away

### To Disable Email Confirmation (For Testing):

1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle it OFF
4. Save changes

### To Check Programmatically:

You can also check users via the Supabase client:

```javascript
// List all users (admin only)
const { data: { users }, error } = await supabase.auth.admin.listUsers()
console.log('All users:', users)

// Check specific user
const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)
console.log('User:', user)
```

### Troubleshooting:

1. **Check Email Spam**: Confirmation emails might go to spam
2. **Check Supabase Logs**: Look for any errors in the Auth logs
3. **Verify Environment Variables**: Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
4. **Check Network Tab**: Look for any failed API calls in browser dev tools

### Quick Test:

1. Register a new user
2. Check Supabase Auth → Users → All Users
3. Look for the user in the list
4. Check if they're marked as "Confirmed" or "Unconfirmed"

If users appear as "Unconfirmed", they need to confirm their email before they can log in.
