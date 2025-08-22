const fetch = require('node-fetch')

async function testApiEndpoints() {
  const baseUrl = 'http://localhost:3000'
  const endpoints = [
    '/api/users',
    '/api/donations', 
    '/api/orders',
    '/api/products'
  ]

  console.log('🔍 Testing API endpoints...')
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint}...`)
      const response = await fetch(`${baseUrl}${endpoint}`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ ${endpoint} - Status: ${response.status}`)
        console.log(`   Data keys:`, Object.keys(data))
        if (data.users) console.log(`   Users count: ${data.users.length}`)
        if (data.donations) console.log(`   Donations count: ${data.donations.length}`)
        if (data.orders) console.log(`   Orders count: ${data.orders.length}`)
        if (data.products) console.log(`   Products count: ${data.products.length}`)
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.status}`)
        console.log(`   Error:`, data.error || 'Unknown error')
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Network error:`, error.message)
    }
  }
}

testApiEndpoints()
