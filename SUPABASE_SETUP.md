# Supabase Integration Setup Guide

## Overview

This guide will help you set up Supabase as the database backend for your Boa Me Youth Empowerment website. Supabase provides a PostgreSQL database with real-time features, authentication, and storage.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new organization
4. Create a new project

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings > API**
2. Copy your **Project URL** and **anon/public key**
3. These will be used in your environment variables

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste and run the SQL commands to create all tables and policies

### Database Tables Created:

- **users**: Extended user profiles with roles
- **orders**: Shop orders with payment tracking
- **donations**: Donation records with payment status
- **contact_messages**: Contact form submissions
- **newsletter_subscriptions**: Newsletter email subscriptions
- **products**: Product catalog for the shop

### Row Level Security (RLS) Policies:

- Users can only view their own data
- Admins can view all data
- Public access for creating orders, donations, and contact messages
- Secure access controls for all operations

## Step 5: Configure Authentication (Optional)

If you want to use Supabase Auth instead of the current custom auth:

1. Go to **Authentication > Settings** in Supabase
2. Configure your site URL and redirect URLs
3. Update the auth context to use Supabase Auth

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Test the following features:
   - Contact form submission
   - Newsletter subscription
   - Shop checkout (creates order in database)
   - Donation form (creates donation record)
   - Payment webhooks (updates payment status)

## API Endpoints

### Orders
- **POST** `/api/orders` - Create new order
- **GET** `/api/orders?user_id=xxx` - Get user orders

### Donations
- **POST** `/api/donations` - Create new donation
- **GET** `/api/donations` - Get all donations (admin only)

### Contact
- **POST** `/api/contact` - Submit contact form

### Newsletter
- **POST** `/api/newsletter` - Subscribe to newsletter

### Paystack Webhooks
- **POST** `/api/paystack/webhook` - Handle payment notifications

## Database Schema Details

### Users Table
```sql
- id (UUID, references auth.users)
- email (TEXT, unique)
- name (TEXT)
- role (TEXT: 'admin' | 'user')
- created_at, updated_at (TIMESTAMP)
```

### Orders Table
```sql
- id (UUID, primary key)
- user_id (UUID, optional, references users)
- customer_email, customer_name, customer_phone, customer_address
- items (JSONB - cart items)
- subtotal, shipping, total (DECIMAL)
- status (pending|paid|shipped|delivered|cancelled)
- payment_reference (TEXT, unique)
- payment_status (pending|success|failed)
- created_at, updated_at (TIMESTAMP)
```

### Donations Table
```sql
- id (UUID, primary key)
- donor_name, donor_email, donor_message
- amount (DECIMAL)
- payment_reference (TEXT, unique)
- payment_status (pending|success|failed)
- is_anonymous (BOOLEAN)
- created_at (TIMESTAMP)
```

## Features Implemented

✅ **Database Integration**: All forms save to Supabase
✅ **Order Management**: Complete order lifecycle
✅ **Donation Tracking**: Donation records with payment status
✅ **Contact Management**: Contact form submissions
✅ **Newsletter Subscriptions**: Email subscription management
✅ **Payment Integration**: Paystack webhooks update database
✅ **Security**: Row Level Security policies
✅ **Real-time**: Supabase real-time subscriptions available

## Admin Dashboard Features

The database is ready for admin dashboard features:

- View all orders and update status
- View all donations and donor information
- View contact form submissions
- View newsletter subscribers
- Manage products in the shop
- Payment analytics and reporting

## Next Steps

1. **Set up Supabase Auth** for user authentication
2. **Create admin dashboard** to manage data
3. **Add email notifications** using Supabase Edge Functions
4. **Set up file storage** for product images
5. **Add real-time features** for live updates
6. **Implement analytics** and reporting

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Restart your development server after adding `.env.local`
   - Check that variable names match exactly

2. **Database Connection Errors**
   - Verify your Supabase URL and key are correct
   - Check that the schema has been created

3. **RLS Policy Errors**
   - Ensure all tables have RLS enabled
   - Check that policies are correctly configured

4. **Payment Webhook Issues**
   - Verify webhook URL in Paystack dashboard
   - Check that signature verification is working

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)

For project-specific issues:
- Check the project README.md
- Review the API route implementations
