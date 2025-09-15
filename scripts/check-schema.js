const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupEnhancedSchema() {
  try {
    console.log('🚀 Setting up enhanced events schema directly...')

    // First, let's check if tables already exist by trying to query them
    console.log('🔍 Checking existing tables...')

    // Check events table
    const { data: eventsCheck } = await supabase
      .from('events')
      .select('id')
      .limit(1)

    if (eventsCheck) {
      console.log('✅ Events table exists')
    }

    // Since we can't execute raw SQL, let's insert sample ticket types
    // using the application tables (we'll create them via Supabase dashboard)
    console.log('\n📝 For now, let\'s work with what we have...')
    console.log('The enhanced schema requires manual setup in Supabase dashboard.')
    console.log('\n🎯 Manual Setup Instructions:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to the SQL Editor')
    console.log('3. Copy and paste the content from scripts/enhance-events-schema.sql')
    console.log('4. Execute the SQL to create the enhanced tables')
    
    console.log('\n💡 Alternative: Let\'s create an enhanced events API endpoint that works with the current schema...')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function createEnhancedAPI() {
  console.log('\n🔧 Creating enhanced events API that works with current schema...')
  console.log('This will extend the existing events with ticket type simulation.')
  
  // Test current events
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .limit(3)

  if (error) {
    console.error('❌ Error fetching events:', error.message)
    return
  }

  console.log(`✅ Found ${events.length} events in current schema`)
  events.forEach(event => {
    console.log(`   - ${event.title} (${event.id})`)
  })

  console.log('\n🎯 Next: Let\'s enhance the frontend to support multiple ticket types with the current schema')
}

async function main() {
  await setupEnhancedSchema()
  await createEnhancedAPI()
  process.exit(0)
}

main()