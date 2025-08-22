# Paystack Integration Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:
```env
# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_f30e3750302ddcfa7693c271eb541af511637263
PAYSTACK_SECRET_KEY=sk_test_3825afd73f05b7691ee20e2bfbe8f238d43d1267

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database Configuration (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/baome

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_here

# Email Configuration (for sending receipts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

## Paystack Account Setup

1. **Create a Paystack Account**
   - Go to [paystack.com](https://paystack.com)
   - Sign up for a merchant account
   - Complete your business verification

2. **Get Your API Keys**
   - Log into your Paystack dashboard
   - Go to Settings > API Keys & Webhooks
   - Copy your Public Key and Secret Key
   - Replace the placeholder values in your `.env.local` file

3. **Configure Webhooks**
   - In your Paystack dashboard, go to Settings > API Keys & Webhooks
   - Add a new webhook with the URL: `https://localhost:3001/api/paystack/webhook`
   - Select the following events:
     - `charge.success`
     - `charge.failed`
     - `transfer.success`

## Testing

### Test Mode
- Use test API keys for development
- Test cards: 4084 0840 8408 4081 (Visa), 5078 5078 5078 5078 (Mastercard)
- Test phone numbers: 08012345678, 08123456789

### Live Mode
- Switch to live API keys for production
- Update webhook URLs to your production domain
- Ensure SSL is enabled on your domain

## API Endpoints

### Payment Initialization
- **POST** `/api/paystack/initialize`
- Initializes a payment transaction

### Payment Verification
- **GET** `/api/paystack/verify?reference=REF123`
- Verifies a payment transaction

### Webhook Handler
- **POST** `/api/paystack/webhook`
- Handles Paystack webhook notifications

## Features Implemented

✅ **Shop Checkout**: Cart items can be purchased using Paystack
✅ **Donations**: Direct donations with custom amounts
✅ **Payment Verification**: Automatic verification of payments
✅ **Webhook Support**: Real-time payment notifications
✅ **Error Handling**: Comprehensive error handling and user feedback
✅ **Mobile Money Support**: Supports Ghana mobile money payments
✅ **Card Payments**: Supports international and local cards

## Security Features

- Webhook signature verification
- Environment variable protection
- Payment reference validation
- Secure API key handling

## Next Steps

1. **Database Integration**: Connect to MongoDB to store orders and donations
2. **Email Notifications**: Send confirmation emails to customers
3. **Admin Dashboard**: Add payment management to admin dashboard
4. **Analytics**: Track payment metrics and revenue
5. **Refunds**: Implement refund functionality
6. **Recurring Payments**: Add subscription/donation plans
