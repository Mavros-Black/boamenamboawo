import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    switch (action) {
      case 'create-test-donation':
        // Create a test donation in the database
        const testReference = `TEST_DONATION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const { data: testDonation, error: createError } = await supabaseAdmin
          .from('donations')
          .insert({
            donor_name: 'Test User',
            donor_email: 'test@example.com',
            donor_message: 'Test donation for payment flow verification',
            amount: 25.00,
            payment_reference: testReference,
            payment_status: 'pending',
            is_anonymous: false
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating test donation:', createError)
          return NextResponse.json(
            { error: 'Failed to create test donation', details: createError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Test donation created successfully',
          donation: testDonation,
          testReference
        })

      case 'verify-test-payment':
        const { reference } = body
        
        if (!reference) {
          return NextResponse.json(
            { error: 'Reference is required for verification' },
            { status: 400 }
          )
        }

        // Update donation status to success
        const { data: updatedDonation, error: updateError } = await supabaseAdmin
          .from('donations')
          .update({ payment_status: 'success' })
          .eq('payment_reference', reference)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating donation status:', updateError)
          return NextResponse.json(
            { error: 'Failed to update donation status', details: updateError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Test payment verified successfully',
          donation: updatedDonation
        })

      case 'get-donations':
        // Fetch all donations from database
        const { data: donations, error: fetchError } = await supabaseAdmin
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (fetchError) {
          console.error('Error fetching donations:', fetchError)
          return NextResponse.json(
            { error: 'Failed to fetch donations', details: fetchError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          donations: donations || [],
          count: donations?.length || 0
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: create-test-donation, verify-test-payment, or get-donations' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Test payment flow error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Test database connection and fetch donations
    const { data: donations, error } = await supabaseAdmin
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Database test error:', error)
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Database connection failed',
          error: error.message 
        }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      donationsCount: donations?.length || 0,
      recentDonations: donations || []
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}