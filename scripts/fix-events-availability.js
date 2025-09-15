const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixEventsAvailability() {
  try {
    console.log('🔧 Fixing events availability and dates...')

    // 1. Fix Community Impact Awards - set available tickets
    console.log('📝 Updating Community Impact Awards availability...')
    const { data: communityUpdate, error: communityError } = await supabase
      .from('events')
      .update({ 
        available_tickets: 150,  // Make 150 out of 200 available
        max_tickets: 200
      })
      .eq('id', 'community-impact-awards')
      .select()

    if (communityError) {
      console.error('❌ Error updating Community Impact Awards:', communityError.message)
    } else {
      console.log('✅ Community Impact Awards updated - now has 150/200 tickets available')
    }

    // 2. Fix the other events that have 0 max_tickets and 0 available_tickets
    console.log('📝 Updating events with 0 tickets...')
    
    // Digital Skills Workshop 2025
    const { error: digitalError } = await supabase
      .from('events')
      .update({ 
        available_tickets: 40,
        max_tickets: 50,
        ticket_price: 30
      })
      .eq('id', 'digital-skills-workshop-2025')

    if (digitalError) {
      console.error('❌ Error updating Digital Skills Workshop 2025:', digitalError.message)
    } else {
      console.log('✅ Digital Skills Workshop 2025 updated - 40/50 tickets, GH₵30')
    }

    // Entrepreneurship Bootcamp 2025
    const { error: bootcampError } = await supabase
      .from('events')
      .update({ 
        available_tickets: 65,
        max_tickets: 75,
        ticket_price: 75
      })
      .eq('id', 'entrepreneurship-bootcamp-2025')

    if (bootcampError) {
      console.error('❌ Error updating Entrepreneurship Bootcamp 2025:', bootcampError.message)
    } else {
      console.log('✅ Entrepreneurship Bootcamp 2025 updated - 65/75 tickets, GH₵75')
    }

    // 3. Update dates to be properly in the future
    console.log('📅 Updating event dates to be in the future...')
    
    const updates = [
      {
        id: 'digital-skills-workshop-2025',
        start_date: '2025-02-15T09:00:00+00:00',
        end_date: '2025-02-15T17:00:00+00:00'
      },
      {
        id: 'entrepreneurship-bootcamp-2025', 
        start_date: '2025-04-12T08:30:00+00:00',
        end_date: '2025-04-12T18:00:00+00:00'
      },
      {
        id: 'youth-leadership-summit-2025',
        start_date: '2025-05-18T08:00:00+00:00',
        end_date: '2025-05-18T17:00:00+00:00'
      }
    ]

    for (const update of updates) {
      const { error } = await supabase
        .from('events')
        .update({
          start_date: update.start_date,
          end_date: update.end_date
        })
        .eq('id', update.id)

      if (error) {
        console.error(`❌ Error updating ${update.id}:`, error.message)
      } else {
        console.log(`✅ ${update.id} date updated`)
      }
    }

    // 4. Verify the updates
    console.log('\n🔍 Verifying updates...')
    const { data: updatedEvents, error: verifyError } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })

    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError.message)
      return
    }

    console.log(`\n📊 Updated public events: ${updatedEvents.length}`)
    updatedEvents.forEach((event, index) => {
      const availability = event.available_tickets > 0 ? 'Available' : 'Sold Out'
      const status = event.available_tickets > (event.max_tickets * 0.5) ? '✅' : 
                    event.available_tickets > 0 ? '⚠️' : '❌'
      console.log(`${index + 1}. ${status} ${event.title}`)
      console.log(`   📅 ${event.start_date}`)
      console.log(`   🎟️ ${event.available_tickets}/${event.max_tickets} tickets (GH₵${event.ticket_price})`)
      console.log(`   📍 ${event.location}`)
    })

    console.log('\n🎉 Events availability fixed!')
    console.log('💡 Public events page should now show all events with proper availability')

  } catch (error) {
    console.error('❌ Error fixing events:', error.message)
  }
}

fixEventsAvailability()