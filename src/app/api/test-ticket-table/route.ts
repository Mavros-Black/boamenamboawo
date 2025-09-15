import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Test if ticket_purchases table exists
    const { data: tables, error: tableError } = await supabaseAdmin
      .from('ticket_purchases')
      .select('*')
      .limit(1)

    if (tableError) {
      if (tableError.code === '42P01') {
        // Table does not exist
        return NextResponse.json({
          status: 'missing',
          message: 'ticket_purchases table does not exist',
          sqlToRun: `
-- Run this SQL in your Supabase SQL Editor to create the ticket_purchases table:

CREATE TABLE IF NOT EXISTS ticket_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_reference VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_event_id ON ticket_purchases(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_email ON ticket_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_payment_reference ON ticket_purchases(payment_reference);

-- Enable RLS
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create ticket purchases" ON ticket_purchases
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own purchases" ON ticket_purchases
    FOR SELECT USING (customer_email = auth.jwt() ->> 'email');
          `,
          instructions: [
            '1. Go to your Supabase dashboard',
            '2. Navigate to the SQL Editor',
            '3. Copy and paste the SQL above',
            '4. Click "Run" to execute',
            '5. Refresh this page to verify the table was created'
          ]
        })
      } else {
        return NextResponse.json({
          status: 'error',
          message: 'Database error while checking table',
          error: tableError.message
        }, { status: 500 })
      }
    }

    // Check if events table exists
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('events')
      .select('id, title')
      .limit(5)

    if (eventsError) {
      return NextResponse.json({
        status: 'error',
        message: 'Events table error',
        error: eventsError.message,
        suggestion: 'Make sure the events table exists and is properly configured'
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'ticket_purchases table exists and is accessible',
      ticketPurchasesCount: tables?.length || 0,
      eventsCount: events?.length || 0,
      sampleEvents: events?.map(e => ({ id: e.id, title: e.title })) || []
    })

  } catch (error) {
    console.error('Table check error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check database tables',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { action } = body

    if (action === 'test-ticket-flow') {
      // Test the complete ticket purchase flow
      
      // 1. Check if events exist
      const { data: events, error: eventsError } = await supabaseAdmin
        .from('events')
        .select('*')
        .limit(1)

      if (eventsError || !events || events.length === 0) {
        return NextResponse.json({
          error: 'No events found',
          suggestion: 'Create an event first before testing ticket purchases'
        }, { status: 400 })
      }

      const testEvent = events[0]

      // 2. Create a test ticket purchase
      const testReference = `TEST_TICKET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const { data: purchase, error: purchaseError } = await supabaseAdmin
        .from('ticket_purchases')
        .insert({
          event_id: testEvent.id,
          customer_name: 'Test Customer',
          customer_email: 'test@example.com',
          customer_phone: '+233123456789',
          quantity: 2,
          total_amount: testEvent.ticket_price * 2,
          payment_reference: testReference,
          status: 'pending'
        })
        .select()
        .single()

      if (purchaseError) {
        return NextResponse.json({
          error: 'Failed to create test ticket purchase',
          details: purchaseError.message
        }, { status: 500 })
      }

      // 3. Test updating the purchase (simulate payment verification)
      const { data: updatedPurchase, error: updateError } = await supabaseAdmin
        .from('ticket_purchases')
        .update({ 
          status: 'confirmed',
          payment_status: 'success',
          verified_at: new Date().toISOString()
        })
        .eq('payment_reference', testReference)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({
          error: 'Failed to update test ticket purchase',
          details: updateError.message
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Ticket purchase flow test completed successfully',
        testPurchase: updatedPurchase,
        testEvent: { id: testEvent.id, title: testEvent.title },
        flowSteps: [
          '✅ Event found',
          '✅ Ticket purchase created',
          '✅ Purchase status updated',
          '✅ Payment verification simulated'
        ]
      })
    }

    return NextResponse.json({
      error: 'Invalid action. Use: test-ticket-flow'
    }, { status: 400 })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}