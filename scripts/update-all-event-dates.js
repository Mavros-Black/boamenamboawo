const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateAllEventDates() {
  try {
    console.log('📅 Updating all event dates to be in the future...')
    
    // Get current date and set future dates starting from October 2025
    const currentDate = new Date()
    console.log('Current server time:', currentDate.toISOString())
    
    const eventDateUpdates = [
      {
        id: 'women-in-tech-summit-2025',
        title: 'Women in Tech Summit 2025',
        start_date: '2025-10-15T09:00:00+00:00',
        end_date: '2025-10-15T17:00:00+00:00'
      },
      {
        id: 'youth-climate-action-workshop-2025',
        title: 'Youth Climate Action Workshop',
        start_date: '2025-10-22T08:30:00+00:00',
        end_date: '2025-10-22T16:30:00+00:00'
      },
      {
        id: 'digital-skills-workshop-2025',
        title: 'Digital Skills Workshop 2025',
        start_date: '2025-10-28T09:00:00+00:00',
        end_date: '2025-10-28T17:00:00+00:00'
      },
      {
        id: 'financial-literacy-bootcamp-2025',
        title: 'Financial Literacy Bootcamp',
        start_date: '2025-11-05T09:00:00+00:00',
        end_date: '2025-11-05T17:00:00+00:00'
      },
      {
        id: 'creative-arts-festival-2025',
        title: 'Creative Arts & Media Festival',
        start_date: '2025-11-12T10:00:00+00:00',
        end_date: '2025-11-12T20:00:00+00:00'
      },
      {
        id: 'youth-leadership-summit-2025',
        title: 'Youth Leadership Summit 2025',
        start_date: '2025-11-22T08:00:00+00:00',
        end_date: '2025-11-22T17:00:00+00:00'
      },
      {
        id: 'mental-health-awareness-seminar-2025',
        title: 'Mental Health & Wellbeing Seminar',
        start_date: '2025-12-05T09:00:00+00:00',
        end_date: '2025-12-05T15:00:00+00:00'
      },
      {
        id: 'agricultural-innovation-expo-2025',
        title: 'Agricultural Innovation Expo',
        start_date: '2025-12-15T08:00:00+00:00',
        end_date: '2025-12-15T18:00:00+00:00'
      },
      // Update existing events to better dates
      {
        id: 'boame-youth-serminar',
        title: 'Boame Youth Serminar',
        start_date: '2025-09-28T09:00:00+00:00',
        end_date: '2025-09-28T17:00:00+00:00'
      },
      {
        id: 'entrepreneurship-bootcamp-2025',
        title: 'Entrepreneurship Bootcamp 2025',
        start_date: '2026-01-18T08:30:00+00:00',
        end_date: '2026-01-18T18:00:00+00:00'
      },
      {
        id: 'youth-leadership-summit-2024',
        title: 'Youth Leadership Summit 2024',
        start_date: '2026-02-15T09:00:00+00:00',
        end_date: '2026-02-15T17:00:00+00:00'
      },
      {
        id: 'digital-skills-workshop',
        title: 'Digital Skills Workshop',
        start_date: '2026-03-08T10:00:00+00:00',
        end_date: '2026-03-08T18:00:00+00:00'
      },
      {
        id: 'community-impact-awards',
        title: 'Community Impact Awards',
        start_date: '2026-03-22T18:00:00+00:00',
        end_date: '2026-03-22T22:00:00+00:00'
      }
    ]

    console.log(`📝 Updating ${eventDateUpdates.length} events...`)

    for (const update of eventDateUpdates) {
      const { error } = await supabase
        .from('events')
        .update({
          start_date: update.start_date,
          end_date: update.end_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', update.id)

      if (error) {
        console.error(`❌ Error updating ${update.title}:`, error.message)
      } else {
        console.log(`✅ Updated: ${update.title} -> ${update.start_date.substring(0, 10)}`)
      }
    }

    // Also fix the Youth Leadership Summit 2025 availability
    console.log('\n🔧 Fixing Youth Leadership Summit 2025 availability...')
    const { error: fixError } = await supabase
      .from('events')
      .update({
        available_tickets: 145,
        max_tickets: 200
      })
      .eq('id', 'youth-leadership-summit-2025')

    if (fixError) {
      console.error('❌ Error fixing availability:', fixError.message)
    } else {
      console.log('✅ Youth Leadership Summit 2025 availability fixed: 145/200 tickets')
    }

    // Verify all published future events
    console.log('\n🔍 Verifying all published future events...')
    const { data: futureEvents, error: verifyError } = await supabase
      .from('events')
      .select('id, title, start_date, available_tickets, max_tickets, ticket_price, location')
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })

    if (verifyError) {
      console.error('❌ Error verifying events:', verifyError.message)
      return
    }

    console.log(`\n🎉 Total published future events: ${futureEvents.length}`)
    console.log('\n📅 Complete Events Schedule:')
    futureEvents.forEach((event, index) => {
      const date = new Date(event.start_date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      const availability = event.available_tickets > 0 ? '✅ Available' : '❌ Sold Out'
      const ticketsStatus = `${event.available_tickets}/${event.max_tickets}`
      console.log(`${index + 1}. ${date} - ${event.title}`)
      console.log(`   📍 ${event.location} | 🎟️ ${ticketsStatus} | 💰 GH₵${event.ticket_price} | ${availability}`)
    })

    console.log('\n🌟 The public events page should now show a great variety of events!')
    console.log('💡 Events span multiple months with diverse topics and locations')

  } catch (error) {
    console.error('❌ Error updating event dates:', error.message)
  }
}

updateAllEventDates()