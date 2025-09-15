import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'

    let query = supabaseAdmin.from('events').select('*')
    
    // Filter by status if not 'all'
    if (status !== 'all') {
      query = query.eq('status', status)
      // Only future events for public (published status)
      if (status === 'published') {
        query = query.gte('start_date', new Date().toISOString())
      }
    }
    
    query = query.order('start_date', { ascending: true })

    const { data: events, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const body = await request.json()
    const {
      title,
      description,
      start_date,
      end_date,
      location,
      venue,
      ticket_price,
      max_tickets,
      status,
      image_url
    } = body

    // Validate required fields
    if (!title || !start_date || !end_date || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, start_date, end_date, location' },
        { status: 400 }
      )
    }

    // Generate a unique ID
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    // Create the event
    const eventData = {
      id,
      title,
      description: description || '',
      start_date,
      end_date,
      location,
      venue: venue || '',
      ticket_price: parseFloat(ticket_price) || 0,
      max_tickets: parseInt(max_tickets) || 100,
      available_tickets: parseInt(max_tickets) || 100,
      status: status || 'draft',
      image_url: image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create event', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}