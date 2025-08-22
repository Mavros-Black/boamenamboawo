#!/usr/bin/env node

/**
 * Manage Supabase Users Script
 * Check, list, and manage users in Supabase database
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

async function listUsers() {
  console.log('📋 Listing all users in Supabase...\n')
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching users:', error.message)
      return
    }
    
    if (!users || users.length === 0) {
      console.log('📭 No users found in the database')
      return
    }
    
    console.log(`📊 Found ${users.length} users:\n`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Created: ${user.created_at}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

async function createTestUsers() {
  console.log('🚀 Creating test users in Supabase...\n')
  
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
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'John Doe',
        email: 'john@example.com',
        password: userHash,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
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
      console.log('\n💡 The users table might not exist or have the wrong structure')
      console.log('   Please check your Supabase database schema')
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
          console.log('   This might be due to:')
          console.log('   - Duplicate email constraint')
          console.log('   - Missing required fields')
          console.log('   - Wrong data types')
        } else {
          console.log(`✅ Created user: ${user.email}`)
        }
      }
    }
    
    // Verify users were created
    console.log('\n🔍 Verifying users...')
    await listUsers()
    
    console.log('\n🎉 User setup completed!')
    console.log('\n📝 Test credentials:')
    console.log('  Admin: admin@example.com / admin123')
    console.log('  User: john@example.com / user123')
    
  } catch (error) {
    console.error('💥 Setup error:', error.message)
  }
}

async function checkTableStructure() {
  console.log('🔍 Checking users table structure...\n')
  
  try {
    // Try to get table info by selecting all columns
    const { data: sampleUser, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error accessing users table:', error.message)
      console.log('\n💡 Possible issues:')
      console.log('   - Table does not exist')
      console.log('   - Insufficient permissions')
      console.log('   - Wrong table name')
      return
    }
    
    console.log('✅ Users table is accessible')
    
    if (sampleUser && sampleUser.length > 0) {
      console.log('\n📋 Table structure (from sample data):')
      const columns = Object.keys(sampleUser[0])
      columns.forEach(column => {
        console.log(`   - ${column}: ${typeof sampleUser[0][column]}`)
      })
    } else {
      console.log('\n📋 Table exists but is empty')
    }
    
  } catch (error) {
    console.error('💥 Error checking table structure:', error.message)
  }
}

// Main function
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'list':
      await listUsers()
      break
    case 'create':
      await createTestUsers()
      break
    case 'check':
      await checkTableStructure()
      break
    default:
      console.log('🔧 Supabase Users Management Tool\n')
      console.log('Usage:')
      console.log('  node scripts/manage-supabase-users.js list    - List all users')
      console.log('  node scripts/manage-supabase-users.js create  - Create test users')
      console.log('  node scripts/manage-supabase-users.js check   - Check table structure')
      break
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { listUsers, createTestUsers, checkTableStructure }
