#!/usr/bin/env node

/**
 * Check Supabase Configuration
 */

require('dotenv').config({ path: '.env.local' })

console.log('🔍 Checking Supabase Configuration...\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Environment Variables:')
console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Missing Supabase configuration!')
  console.log('\nTo set up Supabase:')
  console.log('1. Go to https://supabase.com')
  console.log('2. Create a new project')
  console.log('3. Get your project URL and anon key')
  console.log('4. Add them to your .env.local file:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_project_url')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')
} else {
  console.log('\n✅ Supabase configuration found!')
  console.log('\nNext steps:')
  console.log('1. Run: npm run setup:users')
  console.log('2. This will create the test users in your Supabase database')
}
