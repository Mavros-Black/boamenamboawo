#!/usr/bin/env node

/**
 * Setup Products Table Script
 * Creates the products table in Supabase database
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

async function setupProductsTable() {
  console.log('🚀 Setting up products table in Supabase...\n')
  
  try {
    // SQL to create the products table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        category VARCHAR(100),
        in_stock BOOLEAN DEFAULT true,
        stock_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    console.log('📋 Creating products table...')
    console.log('SQL:', createTableSQL)
    
    // Note: We can't execute DDL directly with the client
    // This is for reference - you'll need to run this in Supabase SQL Editor
    
    console.log('\n💡 To create the products table:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Click on "SQL Editor" in the left sidebar')
    console.log('3. Create a new query and paste this SQL:')
    console.log('\n' + createTableSQL)
    console.log('\n4. Click "Run" to execute the query')
    
    // Check if table exists after creation
    console.log('\n🔍 Checking if products table exists...')
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Products table does not exist yet')
      console.log('Error:', error.message)
      console.log('\n📝 Please create the table using the SQL above')
    } else {
      console.log('✅ Products table exists!')
      console.log(`📊 Current products: ${products.length}`)
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
        name: 'Youth Empowerment T-Shirt',
        description: 'Comfortable cotton t-shirt with youth empowerment message',
        price: 25.00,
        image_url: '/images/products/tshirt.jpg',
        category: 'Clothing',
        in_stock: true,
        stock_quantity: 50
      },
      {
        name: 'Community Support Hoodie',
        description: 'Warm hoodie supporting community development',
        price: 45.00,
        image_url: '/images/products/hoodie.jpg',
        category: 'Clothing',
        in_stock: true,
        stock_quantity: 30
      },
      {
        name: 'Education Fund Donation',
        description: 'Support education initiatives in local communities',
        price: 100.00,
        image_url: '/images/products/education.jpg',
        category: 'Donations',
        in_stock: true,
        stock_quantity: 999
      },
      {
        name: 'Healthcare Support Package',
        description: 'Support healthcare initiatives in rural areas',
        price: 75.00,
        image_url: '/images/products/healthcare.jpg',
        category: 'Donations',
        in_stock: true,
        stock_quantity: 500
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
      console.log('\n💡 The products table does not exist')
      console.log('   Please run: node scripts/setup-products-table.js setup')
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
    case 'setup':
      await setupProductsTable()
      break
    case 'create':
      await createSampleProducts()
      break
    default:
      console.log('🔧 Products Table Setup Tool\n')
      console.log('Usage:')
      console.log('  node scripts/setup-products-table.js setup   - Show SQL to create table')
      console.log('  node scripts/setup-products-table.js create  - Create sample products')
      break
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { setupProductsTable, createSampleProducts }
