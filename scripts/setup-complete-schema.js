#!/usr/bin/env node

/**
 * Complete Database Schema Setup Script
 * Creates all necessary tables for the application
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

async function setupCompleteSchema() {
  console.log('🚀 Setting up complete database schema...\n')
  
  try {
    // Complete SQL schema
    const completeSchemaSQL = `
-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR BAOME APPLICATION
-- =====================================================

-- 1. USERS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
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

-- 3. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_message TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_reference VARCHAR(255) UNIQUE NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_reference VARCHAR(255) UNIQUE NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  start_date DATE,
  end_date DATE,
  location VARCHAR(255),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. NEWSLETTER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Donations indexes
CREATE INDEX IF NOT EXISTS idx_donations_payment_reference ON donations(payment_reference);
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Programs indexes
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON programs(created_at);

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON newsletter_subscriptions(is_active);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - allow all operations for now)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on donations" ON donations FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on programs" ON programs FOR ALL USING (true);
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations on newsletter_subscriptions" ON newsletter_subscriptions FOR ALL USING (true);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample products (if not exists)
INSERT INTO products (name, description, price, image_url, category, in_stock, stock_quantity) 
SELECT * FROM (VALUES
  ('Youth Empowerment T-Shirt', 'Comfortable cotton t-shirt with youth empowerment message', 25.00, '/images/products/tshirt.jpg', 'Clothing', true, 50),
  ('Community Support Hoodie', 'Warm hoodie supporting community development', 45.00, '/images/products/hoodie.jpg', 'Clothing', true, 30),
  ('Education Fund Donation', 'Support education initiatives in local communities', 100.00, '/images/products/education.jpg', 'Donations', true, 999),
  ('Healthcare Support Package', 'Support healthcare initiatives in rural areas', 75.00, '/images/products/healthcare.jpg', 'Donations', true, 500)
) AS v(name, description, price, image_url, category, in_stock, stock_quantity)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = v.name);

-- Insert sample programs (if not exists)
INSERT INTO programs (title, description, category, status, location, max_participants)
SELECT * FROM (VALUES
  ('Youth Leadership Training', 'Empowering young leaders with essential skills for community development', 'Education', 'active', 'Accra, Ghana', 50),
  ('Healthcare Outreach', 'Providing basic healthcare services to rural communities', 'Healthcare', 'active', 'Kumasi, Ghana', 100),
  ('Skills Development Workshop', 'Teaching practical skills for economic empowerment', 'Training', 'active', 'Tamale, Ghana', 75)
) AS v(title, description, category, status, location, max_participants)
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE title = v.title);

-- Insert sample blog posts (if not exists)
INSERT INTO blog_posts (title, content, excerpt, status, published_at)
SELECT * FROM (VALUES
  ('Empowering Communities Through Education', 'Education is the foundation of community development...', 'How education initiatives are transforming local communities', 'published', NOW()),
  ('The Impact of Youth Leadership Programs', 'Young leaders are the future of our communities...', 'Exploring the benefits of youth leadership development', 'published', NOW()),
  ('Healthcare Access in Rural Areas', 'Access to healthcare is a fundamental human right...', 'Addressing healthcare challenges in rural communities', 'published', NOW())
) AS v(title, content, excerpt, status, published_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE title = v.title);
`

    console.log('📋 Complete schema SQL generated')
    console.log('\n💡 To create the complete database schema:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Click on "SQL Editor" in the left sidebar')
    console.log('3. Create a new query and paste the SQL below')
    console.log('4. Click "Run" to execute the query')
    
    // Save SQL to file
    const fs = require('fs')
    fs.writeFileSync('complete-schema.sql', completeSchemaSQL)
    console.log('\n✅ SQL saved to: complete-schema.sql')
    
    console.log('\n📝 SQL to execute:')
    console.log(completeSchemaSQL)
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

async function checkSchemaStatus() {
  console.log('🔍 Checking current database schema status...\n')
  
  try {
    const tables = [
      'users',
      'products', 
      'donations',
      'orders',
      'programs',
      'blog_posts',
      'contacts',
      'newsletter_subscriptions'
    ]
    
    console.log('📋 Checking tables:\n')
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: Table exists`)
        }
      } catch (err) {
        console.log(`❌ ${table}: Table does not exist`)
      }
    }
    
    console.log('\n📊 Summary:')
    console.log('- ✅ = Table exists and is accessible')
    console.log('- ❌ = Table does not exist or has issues')
    console.log('\n💡 Run setup to create missing tables')
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

async function createSampleData() {
  console.log('🚀 Creating sample data for all tables...\n')
  
  try {
    // Check if tables exist first
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
    
    if (productsError) {
      console.log('❌ Products table does not exist. Please run schema setup first.')
      return
    }
    
    console.log(`📊 Current data count:`)
    console.log(`- Products: ${products?.length || 0}`)
    
    // Create sample products if none exist
    if (!products || products.length === 0) {
      console.log('\n📝 Creating sample products...')
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
        }
      ]
      
      const { data: insertedProducts, error: insertError } = await supabase
        .from('products')
        .insert(sampleProducts)
      
      if (insertError) {
        console.error('❌ Error creating products:', insertError.message)
      } else {
        console.log('✅ Created sample products')
      }
    }
    
    console.log('\n🎉 Sample data creation completed!')
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Main function
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'setup':
      await setupCompleteSchema()
      break
    case 'check':
      await checkSchemaStatus()
      break
    case 'sample':
      await createSampleData()
      break
    default:
      console.log('🔧 Complete Database Schema Setup Tool\n')
      console.log('Usage:')
      console.log('  node scripts/setup-complete-schema.js setup   - Generate complete schema SQL')
      console.log('  node scripts/setup-complete-schema.js check   - Check current schema status')
      console.log('  node scripts/setup-complete-schema.js sample  - Create sample data')
      break
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { setupCompleteSchema, checkSchemaStatus, createSampleData }
