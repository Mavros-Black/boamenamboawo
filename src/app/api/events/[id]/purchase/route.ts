import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { id } = await params
    const body = await request.json()
    const { 
      quantity, 
      customer_name, 
      customer_email, 
      customer_phone,
      payment_reference 
    } = body

    // Validate required fields
    if (!quantity || !customer_name || !customer_email || !payment_reference) {
      return NextResponse.json({ 
        error: 'Missing required fields: quantity, customer_name, customer_email, payment_reference' 
      }, { status: 400 })
    }

    // Get event details
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check ticket availability
    if (event.available_tickets < quantity) {
      return NextResponse.json({ 
        error: 'Not enough tickets available' 
      }, { status: 400 })
    }

    const totalAmount = event.ticket_price * quantity

    // Create ticket purchase record
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('ticket_purchases')
      .insert({
        event_id: id,
        customer_name,
        customer_email,
        customer_phone,
        quantity,
        total_amount: totalAmount,
        payment_reference,
        status: 'pending'
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError)
      return NextResponse.json({ 
        error: 'Failed to create purchase record' 
      }, { status: 500 })
    }

    // Update available tickets (will be confirmed when payment is verified)
    const { error: ticketUpdateError } = await supabaseAdmin
      .from('events')
      .update({ 
        available_tickets: event.available_tickets - quantity 
      })
      .eq('id', id)

    if (ticketUpdateError) {
      console.error('Ticket update error:', ticketUpdateError)
      // Rollback purchase if ticket update fails
      await supabaseAdmin
        .from('ticket_purchases')
        .delete()
        .eq('id', purchase.id)
      
      return NextResponse.json({ 
        error: 'Failed to reserve tickets' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      purchase,
      message: 'Tickets reserved successfully. Complete payment to confirm.'
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}