#!/usr/bin/env node

/**
 * Setup Supabase Users Script
 * Creates users in Supabase database with proper credentials
 */

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupUsers() {
  console.log('🚀 Setting up users in Supabase...')
  
  try {
    // Generate password hashes
    const adminPassword = 'admin123'
    const userPassword = 'user123'
    
    const adminHash = await bcrypt.hash(adminPassword, 10)
    const userHash = await bcrypt.hash(userPassword, 10)
    
    console.log('🔐 Generated password hashes')
    
    // Users to create
    const users = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001', // UUID for user
        name: 'John Doe',
        email: 'john@example.com',
        password: userHash,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002', // UUID for admin
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminHash,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    console.log('📝 Users to create:')
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`)
    })
    
    // Check if users table exists
    console.log('\n🔍 Checking users table...')
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Error checking users table:', checkError.message)
      console.log('💡 Make sure the users table exists in your Supabase database')
      console.log('   You can create it using the SQL from supabase-schema.sql')
      return
    }
    
    console.log('✅ Users table exists')
    
    // Check for existing users
    const { data: currentUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, email, role')
    
    if (fetchError) {
      console.error('❌ Error fetching existing users:', fetchError.message)
      return
    }
    
    console.log(`📊 Found ${currentUsers.length} existing users`)
    
    // Create or update users
    for (const user of users) {
      const existingUser = currentUsers.find(u => u.email === user.email)
      
      if (existingUser) {
        console.log(`🔄 Updating existing user: ${user.email}`)
        
        const { error: updateError } = await supabase
          .from('users')
          .update({
            name: user.name,
            password: user.password,
            role: user.role,
            updated_at: user.updated_at
          })
          .eq('email', user.email)
        
        if (updateError) {
          console.error(`❌ Error updating user ${user.email}:`, updateError.message)
        } else {
          console.log(`✅ Updated user: ${user.email}`)
        }
      } else {
        console.log(`➕ Creating new user: ${user.email}`)
        
        const { error: insertError } = await supabase
          .from('users')
          .insert([user])
        
        if (insertError) {
          console.error(`❌ Error creating user ${user.email}:`, insertError.message)
        } else {
          console.log(`✅ Created user: ${user.email}`)
        }
      }
    }
    
    // Verify users were created
    console.log('\n🔍 Verifying users...')
    const { data: finalUsers, error: verifyError } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: true })
    
    if (verifyError) {
      console.error('❌ Error verifying users:', verifyError.message)
      return
    }
    
    console.log('\n📋 Final users in database:')
    finalUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`)
    })
    
    console.log('\n🎉 User setup completed!')
    console.log('\n📝 Test credentials:')
    console.log('  Admin: admin@example.com / admin123')
    console.log('  User: john@example.com / user123')
    
  } catch (error) {
    console.error('💥 Setup error:', error.message)
  }
}

// Run the setup
if (require.main === module) {
  setupUsers()
}

module.exports = { setupUsers }
