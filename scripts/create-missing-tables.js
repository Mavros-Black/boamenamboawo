#!/usr/bin/env node

/**
 * Create Missing Tables Script
 * Directly creates missing tables using Supabase client
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

async function createMissingTables() {
  console.log('🚀 Creating missing tables...\n')
  
  try {
    // Create programs table
    console.log('📋 Creating programs table...')
    const { error: programsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (programsError) {
      console.log('⚠️ Programs table might already exist or need manual creation')
    } else {
      console.log('✅ Programs table created')
    }
    
    // Create blog_posts table
    console.log('📋 Creating blog_posts table...')
    const { error: blogError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })
    
    if (blogError) {
      console.log('⚠️ Blog posts table might already exist or need manual creation')
    } else {
      console.log('✅ Blog posts table created')
    }
    
    // Create contacts table
    console.log('📋 Creating contacts table...')
    const { error: contactsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS contacts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (contactsError) {
      console.log('⚠️ Contacts table might already exist or need manual creation')
    } else {
      console.log('✅ Contacts table created')
    }
    
    console.log('\n🎉 Table creation completed!')
    console.log('\n💡 If tables were not created automatically, please run the SQL manually in Supabase SQL Editor')
    
  } catch (error) {
    console.error('💥 Error:', error.message)
    console.log('\n💡 The tables need to be created manually in Supabase SQL Editor')
    console.log('   Please copy the SQL from complete-schema.sql and run it in Supabase')
  }
}

async function insertSampleData() {
  console.log('🚀 Inserting sample data...\n')
  
  try {
    // Insert sample programs
    console.log('📝 Inserting sample programs...')
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .insert([
        {
          title: 'Youth Leadership Training',
          description: 'Empowering young leaders with essential skills for community development',
          category: 'Education',
          status: 'active',
          location: 'Accra, Ghana',
          max_participants: 50
        },
        {
          title: 'Healthcare Outreach',
          description: 'Providing basic healthcare services to rural communities',
          category: 'Healthcare',
          status: 'active',
          location: 'Kumasi, Ghana',
          max_participants: 100
        },
        {
          title: 'Skills Development Workshop',
          description: 'Teaching practical skills for economic empowerment',
          category: 'Training',
          status: 'active',
          location: 'Tamale, Ghana',
          max_participants: 75
        }
      ])
    
    if (programsError) {
      console.log('⚠️ Could not insert programs:', programsError.message)
    } else {
      console.log('✅ Sample programs inserted')
    }
    
    // Insert sample blog posts
    console.log('📝 Inserting sample blog posts...')
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: 'Empowering Communities Through Education',
          content: 'Education is the foundation of community development. Our programs focus on providing quality education to underserved communities...',
          excerpt: 'How education initiatives are transforming local communities',
          status: 'published',
          published_at: new Date().toISOString()
        },
        {
          title: 'The Impact of Youth Leadership Programs',
          content: 'Young leaders are the future of our communities. Through our leadership programs, we empower youth to take charge...',
          excerpt: 'Exploring the benefits of youth leadership development',
          status: 'published',
          published_at: new Date().toISOString()
        },
        {
          title: 'Healthcare Access in Rural Areas',
          content: 'Access to healthcare is a fundamental human right. Our healthcare outreach programs bring essential services...',
          excerpt: 'Addressing healthcare challenges in rural communities',
          status: 'published',
          published_at: new Date().toISOString()
        }
      ])
    
    if (blogError) {
      console.log('⚠️ Could not insert blog posts:', blogError.message)
    } else {
      console.log('✅ Sample blog posts inserted')
    }
    
    console.log('\n🎉 Sample data insertion completed!')
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Main function
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'create':
      await createMissingTables()
      break
    case 'sample':
      await insertSampleData()
      break
    default:
      console.log('🔧 Missing Tables Creation Tool\n')
      console.log('Usage:')
      console.log('  node scripts/create-missing-tables.js create  - Create missing tables')
      console.log('  node scripts/create-missing-tables.js sample  - Insert sample data')
      break
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { createMissingTables, insertSampleData }
