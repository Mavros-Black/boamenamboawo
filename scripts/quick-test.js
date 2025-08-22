#!/usr/bin/env node

/**
 * Quick Production Test Script
 * Tests basic functionality without full test suite
 * Run with: node scripts/quick-test.js
 */

const http = require('http')

// Import and setup test environment
const { testEnvVars } = require('./setup-test-env')

// Set environment variables for testing
Object.entries(testEnvVars).forEach(([key, value]) => {
  process.env[key] = value
})

const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testUsers: {
    admin: { email: 'admin@example.com', password: 'admin123' },
    user: { email: 'john@example.com', password: 'user123' }
  }
}

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
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

    const req = http.request(requestOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => data += chunk)
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {}
          resolve({ status: res.statusCode, data: jsonData })
        } catch (error) {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })

    req.on('error', reject)
    if (options.body) req.write(JSON.stringify(options.body))
    req.end()
  })
}

async function quickTest() {
  console.log('🚀 Quick Production Test')
  console.log('=' * 40)
  
  let passed = 0
  let failed = 0

  // Test 1: Server is running
  try {
    console.log('🧪 Testing server connectivity...')
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/me`)
    console.log('✅ Server is running')
    passed++
  } catch (error) {
    console.log('❌ Server is not running')
    console.log('   Please start the development server with: npm run dev')
    failed++
    return
  }

  // Test 2: Admin login
  try {
    console.log('🧪 Testing admin login...')
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
      method: 'POST',
      body: TEST_CONFIG.testUsers.admin
    })
    
    if (response.status === 200 && response.data.user.role === 'admin') {
      console.log('✅ Admin login working')
      passed++
    } else {
      throw new Error(`Login failed: ${response.status}`)
    }
  } catch (error) {
    console.log('❌ Admin login failed:', error.message)
    failed++
  }

  // Test 3: User login
  try {
    console.log('🧪 Testing user login...')
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
      method: 'POST',
      body: TEST_CONFIG.testUsers.user
    })
    
    if (response.status === 200 && response.data.user.role === 'user') {
      console.log('✅ User login working')
      passed++
    } else {
      throw new Error(`Login failed: ${response.status}`)
    }
  } catch (error) {
    console.log('❌ User login failed:', error.message)
    failed++
  }

  // Test 4: Environment variables
  try {
    console.log('🧪 Testing environment configuration...')
    const requiredVars = ['JWT_SECRET', 'NEXT_PUBLIC_BASE_URL']
    const missingVars = requiredVars.filter(varName => !process.env[varName])
    
    if (missingVars.length === 0) {
      console.log('✅ Environment variables configured')
      passed++
    } else {
      throw new Error(`Missing: ${missingVars.join(', ')}`)
    }
  } catch (error) {
    console.log('❌ Environment configuration failed:', error.message)
    failed++
  }

  // Test 5: Basic API endpoints
  try {
    console.log('🧪 Testing basic API endpoints...')
    const endpoints = [
      '/api/donations',
      '/api/orders',
      '/api/programs'
    ]
    
    let workingEndpoints = 0
    for (const endpoint of endpoints) {
      try {
        const response = await makeRequest(`${TEST_CONFIG.baseUrl}${endpoint}`)
        if (response.status !== 500) {
          workingEndpoints++
        }
      } catch (error) {
        // Endpoint might not exist, that's okay
      }
    }
    
    if (workingEndpoints > 0) {
      console.log(`✅ ${workingEndpoints}/${endpoints.length} API endpoints working`)
      passed++
    } else {
      throw new Error('No API endpoints responding')
    }
  } catch (error) {
    console.log('❌ API endpoints test failed:', error.message)
    failed++
  }

  // Results
  console.log('\n' + '=' * 40)
  console.log('📊 Quick Test Results:')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
  
  if (failed === 0) {
    console.log('\n🎉 All quick tests passed! Basic functionality is working.')
    console.log('💡 Run full test suite with: npm run test:production')
  } else {
    console.log('\n⚠️ Some tests failed. Please check the issues above.')
  }
}

// Run the test
if (require.main === module) {
  quickTest().catch(console.error)
}

module.exports = { quickTest }
