#!/usr/bin/env node

/**
 * Check Products Script
 * Check and manage products in the database
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkProducts() {
  console.log('🔍 Checking products in database...\n')
  
  try {
    // Check different possible table names
    const tableNames = [
      'products',
      'shop_products',
      'items',
      'goods'
    ]
    
    console.log('📋 Checking product tables:\n')
    
    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`)
        } else {
          console.log(`✅ ${tableName}: ${data.length} products`)
          if (data.length > 0) {
            console.log('\n📦 Products found:')
            data.forEach((product, index) => {
              console.log(`${index + 1}. ${product.name || product.title || 'Unnamed Product'}`)
              console.log(`   ID: ${product.id}`)
              console.log(`   Price: $${product.price || 'N/A'}`)
              console.log(`   Status: ${product.status || product.in_stock ? 'In Stock' : 'Out of Stock'}`)
              console.log(`   Created: ${product.created_at}`)
              console.log('')
            })
          }
        }
      } catch (err) {
        console.log(`❌ ${tableName}: Table does not exist`)
      }
    }
    
    // Check if products table exists and create sample data if needed
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) {
      console.log('\n❌ Products table does not exist or has issues')
      console.log('Error:', error.message)
      console.log('\n💡 You may need to create the products table first')
    } else {
      console.log(`\n📊 Total products in database: ${products.length}`)
      
      if (products.length === 0) {
        console.log('\n📝 No products found. Would you like to create sample products?')
        console.log('Run: node scripts/create-sample-products.js')
      }
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

async function createSampleProducts() {
  console.log('🚀 Creating sample products...\n')
  
  try {
    const sampleProducts = [
      {
        id: 'prod-001',
        name: 'Youth Empowerment T-Shirt',
        description: 'Comfortable cotton t-shirt with youth empowerment message',
        price: 25.00,
        image_url: '/images/products/tshirt.jpg',
        category: 'Clothing',
        in_stock: true,
        stock_quantity: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'prod-002',
        name: 'Community Support Hoodie',
        description: 'Warm hoodie supporting community development',
        price: 45.00,
        image_url: '/images/products/hoodie.jpg',
        category: 'Clothing',
        in_stock: true,
        stock_quantity: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'prod-003',
        name: 'Education Fund Donation',
        description: 'Support education initiatives in local communities',
        price: 100.00,
        image_url: '/images/products/education.jpg',
        category: 'Donations',
        in_stock: true,
        stock_quantity: 999,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    console.log('📝 Sample products to create:')
    sampleProducts.forEach(product => {
      console.log(`  - ${product.name} - $${product.price}`)
    })
    
    // Check if products table exists
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Error checking products table:', checkError.message)
      console.log('\n💡 The products table might not exist')
      console.log('   You may need to create it first in your Supabase dashboard')
      return
    }
    
    console.log('\n✅ Products table exists')
    
    // Insert sample products
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(sampleProducts)
    
    if (insertError) {
      console.error('❌ Error creating products:', insertError.message)
    } else {
      console.log('✅ Successfully created sample products!')
      console.log('\n📋 Created products:')
      insertedProducts.forEach(product => {
        console.log(`  - ${product.name} (ID: ${product.id})`)
      })
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Main function
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'check':
      await checkProducts()
      break
    case 'create':
      await createSampleProducts()
      break
    default:
      console.log('🔧 Products Management Tool\n')
      console.log('Usage:')
      console.log('  node scripts/check-products.js check   - Check existing products')
      console.log('  node scripts/check-products.js create  - Create sample products')
      break
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { checkProducts, createSampleProducts }
