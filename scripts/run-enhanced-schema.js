const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  console.log('Please ensure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runEnhancedSchema() {
  try {
    console.log('🚀 Running enhanced events schema...')

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'enhance-events-schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.toLowerCase().includes('commit')) continue

      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message)
        } else {
          console.log(`✅ Statement ${i + 1} completed successfully`)
        }
      } catch (err) {
        console.error(`❌ Error executing statement ${i + 1}:`, err.message)
      }
    }

    // Verify the new tables were created
    console.log('\n🔍 Verifying enhanced schema...')
    
    const tablesToCheck = [
      'ticket_types',
      'event_speakers', 
      'event_agenda',
      'event_resources',
      'event_registration_questions',
      'event_promo_codes'
    ]

    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`)
      } else {
        console.log(`✅ Table ${table}: Ready`)
      }
    }

    // Check sample data
    console.log('\n📊 Checking sample data...')
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('ticket_types')
      .select('event_id, name, price')
      .limit(5)

    if (ticketError) {
      console.log('❌ Error checking ticket types:', ticketError.message)
    } else {
      console.log(`✅ Found ${ticketTypes.length} ticket types`)
      ticketTypes.forEach(tt => {
        console.log(`   - ${tt.event_id}: ${tt.name} (GH₵${tt.price})`)
      })
    }

    console.log('\n🎉 Enhanced events schema setup complete!')
    console.log('\n🎯 Next Steps:')
    console.log('1. Update the events API to return ticket types')
    console.log('2. Enhance the event detail page UI')
    console.log('3. Implement multi-step registration form')
    console.log('4. Add promo code functionality')

  } catch (error) {
    console.error('❌ Failed to run enhanced schema:', error.message)
    process.exit(1)
  }
}

// Custom function to execute raw SQL (for Supabase)
async function execRawSQL(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { sql })
  return { data, error }
}

runEnhancedSchema()