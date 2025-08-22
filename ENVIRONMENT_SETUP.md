# Environment Setup Guide

## Required Environment Variables

To fix the payment gateway integration, you need to create a `.env.local` file in your project root with the following variables:

### 1. Create `.env.local` file

Create a file named `.env.local` in the root directory of your project (same level as `package.json`) with the following content:

```env
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_f30e3750302ddcfa7693c271eb541af511637263
PAYSTACK_SECRET_KEY=sk_test_3825afd73f05b7691ee20e2bfbe8f238d43d1267

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_here_baome_youth_empowerment_2024

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 2. Restart Your Development Server

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
```

### 3. Test the Payment Integration

1. **Test Payment Page**: Visit `http://localhost:3000/test-payment`
2. **Donation Page**: Visit `http://localhost:3000/donate`
3. **Shop Checkout**: Add items to cart and proceed to checkout

### 4. Paystack Test Cards

Use these test cards for testing:

- **Visa**: 4084 0840 8408 4081
- **Mastercard**: 5078 5078 5078 5078
- **Test Phone**: 08012345678

### 5. Troubleshooting

If you're still getting errors:

1. **Check Console Logs**: Open browser developer tools and check for errors
2. **Verify Environment Variables**: Make sure the `.env.local` file is in the correct location
3. **Restart Server**: Always restart the development server after adding environment variables
4. **Check API Endpoints**: Verify that `/api/paystack/initialize` and `/api/donations` are working

### 6. Production Setup

For production, replace the test keys with your live Paystack keys:

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 7. Current Issues Fixed

✅ **Donation Form Validation**: Fixed empty donor name handling
✅ **Payment Gateway Integration**: Added proper Paystack configuration
✅ **Error Handling**: Improved error messages and debugging
✅ **Payment Callback**: Created payment verification page
✅ **Database Integration**: Added donation status updates

### 8. Next Steps

1. Create the `.env.local` file with the provided configuration
2. Restart your development server
3. Test the donation and payment functionality
4. Configure your Supabase database if needed
5. Set up webhooks for production

The payment gateway should now work correctly once you have the environment variables set up!

