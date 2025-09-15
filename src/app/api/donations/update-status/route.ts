import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { reference, status } = body

    console.log('Received request body:', { reference, status })

    if (!reference || !status) {
      console.error('Missing required fields:', { reference: !!reference, status: !!status })
      return NextResponse.json(
        { error: 'Reference and status are required' },
        { status: 400 }
      )
    }

    console.log('Updating donation status:', { reference, status })

    // First, let's check if the donation exists
    const { data: existingDonation, error: fetchError } = await supabaseAdmin
      .from('donations')
      .select('*')
      .eq('payment_reference', reference)
      .single()

    if (fetchError) {
      console.error('Error fetching donation:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch donation', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!existingDonation) {
      console.log('No donation found with reference:', reference)
      return NextResponse.json(
        { error: 'Donation not found with this payment reference' },
        { status: 404 }
      )
    }

    console.log('Found existing donation:', existingDonation)

    // Update donation status in Supabase
    const { data, error } = await supabaseAdmin
      .from('donations')
      .update({ 
        payment_status: status
      })
      .eq('payment_reference', reference)
      .select()

    if (error) {
      console.error('Error updating donation status:', error)
      return NextResponse.json(
        { error: 'Failed to update donation status', details: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.error('Update operation returned no data for reference:', reference)
      return NextResponse.json(
        { error: 'Update operation failed - no data returned' },
        { status: 500 }
      )
    }

    console.log('Successfully updated donation:', data[0])

    return NextResponse.json({ 
      success: true, 
      donation: data[0],
      message: 'Donation status updated successfully'
    })
  } catch (error) {
    console.error('Donation status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
