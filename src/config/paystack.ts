// Paystack Configuration
export const paystackConfig = {
  // Test keys for development - replace with your actual keys
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_f30e3750302ddcfa7693c271eb541af511637263',
  secretKey: process.env.PAYSTACK_SECRET_KEY || 'sk_test_3825afd73f05b7691ee20e2bfbe8f238d43d1267',
  baseUrl: 'https://api.paystack.co',
  baseUrlLocal: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

// Environment check
export const isPaystackConfigured = () => {
  return paystackConfig.publicKey && paystackConfig.secretKey && 
         paystackConfig.publicKey !== 'pk_test_f30e3750302ddcfa7693c271eb541af511637263' &&
         paystackConfig.secretKey !== 'sk_test_3825afd73f05b7691ee20e2bfbe8f238d43d1267'
}

// Test mode check
export const isTestMode = () => {
  return paystackConfig.publicKey.includes('pk_test_') || 
         paystackConfig.secretKey.includes('sk_test_')
}
