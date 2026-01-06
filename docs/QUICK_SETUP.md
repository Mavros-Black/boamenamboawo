# 🚀 Quick Setup Guide

## ⚠️ Current Issue: 500 Server Error

Your app is showing a 500 error because **Supabase environment variables are not configured**. Here's how to fix it:

## 📋 **Step 1: Set Up Environment Variables**

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add your actual values:**
   ```bash
   # Supabase Configuration (REQUIRED)
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here

   # Paystack Configuration (Optional for now)
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
   PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here

   # Application URLs
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Other settings
   NODE_ENV=development
   ```

## 🔑 **Step 2: Get Supabase Credentials**

### **Option A: Use Your Existing Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign in and select your project
3. Go to **Settings > API**
4. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### **Option B: Create New Supabase Project**
1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Wait for setup to complete
4. Follow Option A steps above

## 🔧 **Step 3: Run the App**

```bash
npm run dev
```

Your app should now work at `http://localhost:3000`

## 🎯 **Quick Test**

After setup, you can test with these credentials:
- **Admin:** admin@boamenameboawo.com / admin123
- **User:** user@example.com / user123

## 📚 **Need More Help?**

Check these detailed guides:
- `SUPABASE_SETUP.md` - Complete Supabase setup
- `DATABASE_SETUP_GUIDE.md` - Database configuration
- `ENVIRONMENT_SETUP.md` - Environment variables

## 🚀 **For Vercel Deployment**

1. Push your code to GitHub ✅ (Already done)
2. Connect your GitHub repo to Vercel
3. Add the same environment variables in Vercel dashboard
4. Deploy! 🎉
