const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addMoreEvents() {
  try {
    console.log('🎯 Adding more diverse events for better showcase...')

    const newEvents = [
      {
        id: 'women-in-tech-summit-2025',
        title: 'Women in Tech Summit 2025',
        description: 'Empowering young women to excel in technology careers. Join industry leaders, get mentorship, and network with inspiring female professionals.',
        start_date: '2025-01-25T09:00:00+00:00',
        end_date: '2025-01-25T17:00:00+00:00',
        location: 'Accra',
        venue: 'Alisa Hotel Conference Center',
        ticket_price: 40,
        max_tickets: 120,
        available_tickets: 95,
        status: 'published'
      },
      {
        id: 'youth-climate-action-workshop-2025',
        title: 'Youth Climate Action Workshop',
        description: 'Learn how to make a real impact on climate change. Practical skills, project planning, and connecting with environmental organizations.',
        start_date: '2025-02-08T08:30:00+00:00',
        end_date: '2025-02-08T16:30:00+00:00',
        location: 'Kumasi',
        venue: 'KNUST Environmental Science Building',
        ticket_price: 25,
        max_tickets: 80,
        available_tickets: 62,
        status: 'published'
      },
      {
        id: 'financial-literacy-bootcamp-2025',
        title: 'Financial Literacy Bootcamp',
        description: 'Master personal finance, budgeting, investing, and entrepreneurship. Build wealth and financial independence from a young age.',
        start_date: '2025-03-22T09:00:00+00:00',
        end_date: '2025-03-22T17:00:00+00:00',
        location: 'Accra',
        venue: 'Ghana Stock Exchange Training Center',
        ticket_price: 55,
        max_tickets: 100,
        available_tickets: 78,
        status: 'published'
      },
      {
        id: 'creative-arts-festival-2025',
        title: 'Creative Arts & Media Festival',
        description: 'Showcase your talent! Music, dance, visual arts, film, and digital media. Workshops, performances, and industry networking.',
        start_date: '2025-04-05T10:00:00+00:00',
        end_date: '2025-04-05T20:00:00+00:00',
        location: 'Tamale',
        venue: 'Northern Regional Cultural Center',
        ticket_price: 35,
        max_tickets: 200,
        available_tickets: 156,
        status: 'published'
      },
      {
        id: 'mental-health-awareness-seminar-2025',
        title: 'Mental Health & Wellbeing Seminar',
        description: 'Breaking stigma, building resilience. Mental health awareness, coping strategies, and support systems for young people.',
        start_date: '2025-06-14T09:00:00+00:00',
        end_date: '2025-06-14T15:00:00+00:00',
        location: 'Cape Coast',
        venue: 'University of Cape Coast Psychology Dept',
        ticket_price: 20,
        max_tickets: 150,
        available_tickets: 123,
        status: 'published'
      },
      {
        id: 'agricultural-innovation-expo-2025',
        title: 'Agricultural Innovation Expo',
        description: 'Modern farming techniques, agtech solutions, and sustainable agriculture. Connect with young farmers and agribusiness professionals.',
        start_date: '2025-07-19T08:00:00+00:00',
        end_date: '2025-07-19T18:00:00+00:00',
        location: 'Sunyani',
        venue: 'Brong Ahafo Agricultural Development Center',
        ticket_price: 45,
        max_tickets: 90,
        available_tickets: 71,
        status: 'published'
      }
    ]

    console.log(`📝 Adding ${newEvents.length} new events...`)

    for (const event of newEvents) {
      // Add timestamps
      const eventData = {
        ...event,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()

      if (error) {
        console.error(`❌ Error adding ${event.title}:`, error.message)
      } else {
        console.log(`✅ Added: ${event.title} (${event.location}) - ${event.available_tickets}/${event.max_tickets} tickets`)
      }
    }

    // Verify the total count
    console.log('\n🔍 Verifying total events...')
    const { data: allPublicEvents, error: countError } = await supabase
      .from('events')
      .select('id, title, start_date, available_tickets, max_tickets, ticket_price, location')
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })

    if (countError) {
      console.error('❌ Error counting events:', countError.message)
      return
    }

    console.log(`\n🎉 Total published future events: ${allPublicEvents.length}`)
    console.log('\n📅 Upcoming Events Schedule:')
    allPublicEvents.forEach((event, index) => {
      const date = new Date(event.start_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      const availability = event.available_tickets > 0 ? '✅ Available' : '❌ Sold Out'
      console.log(`${index + 1}. ${date} - ${event.title} (${event.location}) - GH₵${event.ticket_price} - ${availability}`)
    })

    console.log('\n💡 The public events page should now show a diverse range of events!')
    console.log('🌟 Events cover: Tech, Environment, Finance, Arts, Health, Agriculture')

  } catch (error) {
    console.error('❌ Error adding events:', error.message)
  }
}

addMoreEvents()