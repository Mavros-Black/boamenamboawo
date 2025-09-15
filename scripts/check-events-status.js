const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkEvents() {
  try {
    console.log('🔍 Checking current events in database...')

    // Get all events
    const { data: allEvents, error: allError } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })

    if (allError) {
      console.error('❌ Error fetching all events:', allError.message)
      return
    }

    console.log(`📊 Total events in database: ${allEvents.length}`)
    
    allEvents.forEach((event, index) => {
      const startDate = new Date(event.start_date)
      const now = new Date()
      const isFuture = startDate > now
      
      console.log(`\n${index + 1}. ${event.title}`)
      console.log(`   ID: ${event.id}`)
      console.log(`   Status: ${event.status}`)
      console.log(`   Start Date: ${event.start_date}`)
      console.log(`   Available Tickets: ${event.available_tickets}/${event.max_tickets}`)
      console.log(`   Ticket Price: GH₵${event.ticket_price}`)
      console.log(`   Is Future Event: ${isFuture ? 'Yes' : 'No (Past Event)'}`)
    })

    // Check published future events only
    console.log('\n🎯 Checking published future events (what public sees)...')
    const { data: publicEvents, error: publicError } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })

    if (publicError) {
      console.error('❌ Error fetching public events:', publicError.message)
      return
    }

    console.log(`📊 Published future events: ${publicEvents.length}`)
    
    if (publicEvents.length === 0) {
      console.log('⚠️ No published future events found!')
      console.log('\n💡 Solutions:')
      console.log('1. Update event dates to future dates (2025)')
      console.log('2. Set event status to "published"')
      console.log('3. Ensure available_tickets > 0')
    } else {
      publicEvents.forEach((event, index) => {
        console.log(`\n${index + 1}. ${event.title} - ${event.available_tickets > 0 ? 'Available' : 'SOLD OUT'}`)
      })
    }

    // Check if we need to update dates
    const currentYear = new Date().getFullYear()
    const needsDateUpdate = allEvents.some(event => {
      const eventYear = new Date(event.start_date).getFullYear()
      return eventYear < currentYear || (eventYear === currentYear && new Date(event.start_date) < new Date())
    })

    if (needsDateUpdate) {
      console.log('\n🔧 Some events need date updates to be visible publicly')
      console.log('Would you like me to update them to 2025 dates? (Y/N)')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkEvents()