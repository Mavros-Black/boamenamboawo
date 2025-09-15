import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Check if table exists and get schema info
    const { data: allPurchases, error: allError } = await supabaseAdmin
      .from('ticket_purchases')
      .select('*')
      .limit(5)

    if (allError) {
      return NextResponse.json({
        error: 'Database error',
        details: allError.message,
        code: allError.code,
        hint: allError.hint
      }, { status: 500 })
    }

    // Try to get a single record to see the structure
    const { data: sampleRecord, error: sampleError } = await supabaseAdmin
      .from('ticket_purchases')
      .select('*')
      .limit(1)
      .single()

    return NextResponse.json({
      success: true,
      table_exists: true,
      total_records: allPurchases?.length || 0,
      all_records: allPurchases,
      sample_record: sampleRecord,
      sample_error: sampleError
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { action, reference } = body

    if (action === 'create_test_purchase') {
      // Create a test purchase record
      const testReference = reference || `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const { data: purchase, error: createError } = await supabaseAdmin
        .from('ticket_purchases')
        .insert({
          event_id: 'boame-youth-serminar', // Use an existing event
          customer_name: 'Test Customer',
          customer_email: 'test@example.com',
          customer_phone: '+233123456789',
          quantity: 1,
          total_amount: 75.00,
          payment_reference: testReference,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({
          error: 'Failed to create test purchase',
          details: createError.message,
          code: createError.code,
          hint: createError.hint
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        test_purchase: purchase,
        message: 'Test purchase created successfully'
      })
    }

    if (action === 'test_update') {
      const { reference } = body
      
      if (!reference) {
        return NextResponse.json({ error: 'Reference is required for test_update' }, { status: 400 })
      }

      // Try to update the test purchase
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('ticket_purchases')
        .update({ 
          status: 'confirmed',
          payment_status: 'success'
        })
        .eq('payment_reference', reference)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({
          error: 'Failed to update test purchase',
          details: updateError.message,
          code: updateError.code,
          hint: updateError.hint
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        updated_purchase: updated,
        message: 'Test purchase updated successfully'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Debug POST error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}