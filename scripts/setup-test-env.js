#!/usr/bin/env node

/**
 * Setup Test Environment Variables
 * This script sets up environment variables for testing
 */

const fs = require('fs')
const path = require('path')

// Test environment variables
const testEnvVars = {
  JWT_SECRET: 'test-jwt-secret-key-for-development-only',
  NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: 'pk_test_test_key',
  PAYSTACK_SECRET_KEY: 'sk_test_test_key',
  NODE_ENV: 'development',
  // Mock Supabase for testing
  NEXT_PUBLIC_SUPABASE_URL: 'https://mock.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key'
}

function setupTestEnvironment() {
  console.log('🔧 Setting up test environment variables...')
  
  // Create .env.local file for testing
  const envContent = Object.entries(testEnvVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
  
  const envPath = path.join(process.cwd(), '.env.local')
  
  try {
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Test environment variables created in .env.local')
    console.log('📝 Environment variables set:')
    Object.entries(testEnvVars).forEach(([key, value]) => {
      console.log(`   ${key}=${value}`)
    })
  } catch (error) {
    console.error('❌ Failed to create .env.local:', error.message)
    process.exit(1)
  }
}

// Set environment variables for current process
Object.entries(testEnvVars).forEach(([key, value]) => {
  process.env[key] = value
})

console.log('🔧 Environment variables set for current process')

if (require.main === module) {
  setupTestEnvironment()
}

module.exports = { setupTestEnvironment, testEnvVars }
