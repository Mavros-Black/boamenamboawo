#!/usr/bin/env node

/**
 * Check Supabase Tables Script
 * Shows all tables and their contents
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

async function checkAllTables() {
  console.log('🔍 Checking all tables in Supabase...\n')
  
  try {
    // Common table names to check
    const tableNames = [
      'users',
      'auth.users',
      'profiles',
      'user_profiles',
      'customers',
      'donations',
      'orders',
      'programs',
      'blog_posts',
      'contacts',
      'newsletters'
    ]
    
    console.log('📋 Checking tables:\n')
    
    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(5)
        
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`)
        } else {
          console.log(`✅ ${tableName}: ${data.length} records`)
          if (data.length > 0) {
            console.log(`   Sample data: ${JSON.stringify(data[0], null, 2).substring(0, 100)}...`)
          }
        }
      } catch (err) {
        console.log(`❌ ${tableName}: Table does not exist`)
      }
    }
    
    console.log('\n🔍 Checking custom users table specifically...')
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('❌ Error accessing users table:', error.message)
    } else {
      console.log(`✅ Found ${users.length} users in custom 'users' table`)
      if (users.length > 0) {
        console.log('\n📋 Users in custom table:')
        users.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`)
        })
      }
    }
    
    console.log('\n💡 To see users in Supabase Dashboard:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Click on "Table Editor" in the left sidebar')
    console.log('3. Look for the "users" table (not "Auth > Users")')
    console.log('4. Click on the "users" table to see all records')
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Run the script
if (require.main === module) {
  checkAllTables()
}

module.exports = { checkAllTables }
