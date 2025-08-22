#!/usr/bin/env node

/**
 * Manual Production Testing Script
 * Run with: node scripts/test-production.js
 */

const https = require('https')
const http = require('http')

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testUsers: {
    admin: {
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    },
    user: {
      email: 'john@example.com', 
      password: 'user123',
      role: 'user'
    }
  }
}

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
}

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const isHttps = urlObj.protocol === 'https:'
    const client = isHttps ? https : http
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }

    const req = client.request(requestOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {}
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

// Test runner
async function runTest(testName, testFunction) {
  try {
    console.log(`🧪 Running: ${testName}`)
    await testFunction()
    console.log(`✅ PASSED: ${testName}`)
    testResults.passed++
  } catch (error) {
    console.log(`❌ FAILED: ${testName}`)
    console.log(`   Error: ${error.message}`)
    testResults.failed++
    testResults.errors.push({ test: testName, error: error.message })
  }
}

// Test functions
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication System...')
  
  // Test admin login
  await runTest('Admin Login', async () => {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
      method: 'POST',
      body: {
        email: TEST_CONFIG.testUsers.admin.email,
        password: TEST_CONFIG.testUsers.admin.password
      }
    })
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`)
    }
    
    if (response.data.user.role !== 'admin') {
      throw new Error(`Expected admin role, got ${response.data.user.role}`)
    }
    
    if (!response.data.token) {
      throw new Error('No token returned')
    }
    
    return response.data.token
  })

  // Test user login
  await runTest('User Login', async () => {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
      method: 'POST',
      body: {
        email: TEST_CONFIG.testUsers.user.email,
        password: TEST_CONFIG.testUsers.user.password
      }
    })
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`)
    }
    
    if (response.data.user.role !== 'user') {
      throw new Error(`Expected user role, got ${response.data.user.role}`)
    }
    
    return response.data.token
  })
}

async function testSessionManagement() {
  console.log('\n🔄 Testing Session Management...')
  
  // Get tokens first
  const adminResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    body: {
      email: TEST_CONFIG.testUsers.admin.email,
      password: TEST_CONFIG.testUsers.admin.password
    }
  })
  
  const userResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    body: {
      email: TEST_CONFIG.testUsers.user.email,
      password: TEST_CONFIG.testUsers.user.password
    }
  })
  
  const adminToken = adminResponse.data.token
  const userToken = userResponse.data.token

  // Test token validation
  await runTest('Token Validation', async () => {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`)
    }
  })

  // Test invalid token
  await runTest('Invalid Token Handling', async () => {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer invalid-token' }
    })
    
    if (response.status !== 401) {
      throw new Error(`Expected 401, got ${response.status}`)
    }
  })

  // Test session persistence
  await runTest('Session Persistence', async () => {
    const requests = Array(3).fill(null).map(() => 
      makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      })
    )
    
    const responses = await Promise.all(requests)
    responses.forEach((response, index) => {
      if (response.status !== 200) {
        throw new Error(`Request ${index + 1} failed with status ${response.status}`)
      }
    })
  })
}

async function testRoleBasedAccess() {
  console.log('\n🛡️ Testing Role-Based Access Control...')
  
  // Get tokens
  const adminResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    body: {
      email: TEST_CONFIG.testUsers.admin.email,
      password: TEST_CONFIG.testUsers.admin.password
    }
  })
  
  const userResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    body: {
      email: TEST_CONFIG.testUsers.user.email,
      password: TEST_CONFIG.testUsers.user.password
    }
  })
  
  const adminToken = adminResponse.data.token
  const userToken = userResponse.data.token

  // Test admin access to admin pages
  await runTest('Admin Access to Admin Pages', async () => {
    const adminPages = [
      '/api/dashboard/analytics',
      '/api/dashboard/finance',
      '/api/dashboard/orders',
      '/api/dashboard/donations'
    ]
    
    for (const page of adminPages) {
      const response = await makeRequest(`${TEST_CONFIG.baseUrl}${page}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      })
      
      if (response.status === 403) {
        throw new Error(`Admin denied access to ${page}`)
      }
    }
  })

  // Test user access to public pages
  await runTest('User Access to Public Pages', async () => {
    const publicPages = [
      '/api/dashboard/programs',
      '/api/dashboard/blog',
      '/api/dashboard/donate'
    ]
    
    for (const page of publicPages) {
      const response = await makeRequest(`${TEST_CONFIG.baseUrl}${page}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      })
      
      if (response.status === 403) {
        throw new Error(`User denied access to public page ${page}`)
      }
    }
  })
}

async function testUserProfile() {
  console.log('\n👤 Testing User Profile Management...')
  
  const userResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    body: {
      email: TEST_CONFIG.testUsers.user.email,
      password: TEST_CONFIG.testUsers.user.password
    }
  })
  
  const userToken = userResponse.data.token

  // Test profile viewing
  await runTest('Profile Viewing', async () => {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/user/profile?userId=1`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    })
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`)
    }
    
    if (!response.data.user) {
      throw new Error('No user data returned')
    }
  })

  // Test profile updating
  await runTest('Profile Updating', async () => {
    const updateData = {
      name: 'Updated Test Name',
      phone: '+233 20 999 9999'
    }
    
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${userToken}` },
      body: {
        userId: '1',
        profileData: updateData
      }
    })
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`)
    }
  })
}

async function testDonationSystem() {
  console.log('\n💝 Testing Donation System...')
  
  const userResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    body: {
      email: TEST_CONFIG.testUsers.user.email,
      password: TEST_CONFIG.testUsers.user.password
    }
  })
  
  const adminResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    body: {
      email: TEST_CONFIG.testUsers.admin.email,
      password: TEST_CONFIG.testUsers.admin.password
    }
  })
  
  const userToken = userResponse.data.token
  const adminToken = adminResponse.data.token

  // Test donation creation
  await runTest('Donation Creation', async () => {
    const donationData = {
      donor_name: 'Test Donor',
      donor_email: 'test@example.com',
      amount: 100,
      message: 'Test donation',
      payment_reference: 'TEST_REF_123',
      payment_status: 'pending'
    }
    
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/donations`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${userToken}` },
      body: donationData
    })
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`)
    }
  })

  // Test admin viewing donations
  await runTest('Admin View Donations', async () => {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/donations`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })
    
    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`)
    }
  })
}

async function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...')
  
  // Test 404 handling
  await runTest('404 Error Handling', async () => {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/nonexistent`)
    
    if (response.status !== 404) {
      throw new Error(`Expected 404, got ${response.status}`)
    }
  })

  // Test invalid data handling
  await runTest('Invalid Data Handling', async () => {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
      method: 'POST',
      body: { email: 'test@example.com' } // Missing password
    })
    
    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`)
    }
  })
}

async function testEnvironmentConfiguration() {
  console.log('\n⚙️ Testing Environment Configuration...')
  
  // Check required environment variables
  await runTest('Required Environment Variables', async () => {
    const requiredVars = [
      'JWT_SECRET',
      'NEXT_PUBLIC_BASE_URL',
      'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
      'PAYSTACK_SECRET_KEY'
    ]
    
    const missingVars = requiredVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
    }
  })
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Production Readiness Tests...')
  console.log(`📍 Testing against: ${TEST_CONFIG.baseUrl}`)
  console.log('=' * 60)
  
  try {
    await testAuthentication()
    await testSessionManagement()
    await testRoleBasedAccess()
    await testUserProfile()
    await testDonationSystem()
    await testErrorHandling()
    await testEnvironmentConfiguration()
    
    console.log('\n' + '=' * 60)
    console.log('📊 Test Results Summary:')
    console.log(`✅ Passed: ${testResults.passed}`)
    console.log(`❌ Failed: ${testResults.failed}`)
    console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`)
    
    if (testResults.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Ready for production!')
      process.exit(0)
    } else {
      console.log('\n⚠️ Some tests failed. Please fix issues before production deployment.')
      console.log('\nFailed tests:')
      testResults.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`)
      })
      process.exit(1)
    }
    
  } catch (error) {
    console.error('💥 Test runner error:', error.message)
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
}

module.exports = { runAllTests, testResults }
