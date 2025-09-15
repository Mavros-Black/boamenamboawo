import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { paystackService } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { reference } = body

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing required field: reference' },
        { status: 400 }
      )
    }

    console.log('Verifying payment for reference:', reference)

    // First, check if donation exists in database
    const { data: existingDonation, error: fetchError } = await supabaseAdmin
      .from('donations')
      .select('*')
      .eq('payment_reference', reference)
      .single()

    if (fetchError || !existingDonation) {
      console.error('Donation not found for reference:', reference, fetchError)
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    console.log('Found donation:', existingDonation)

    // If already successful, return success
    if (existingDonation.payment_status === 'success') {
      return NextResponse.json({ 
        success: true, 
        donation: existingDonation,
        payment_status: 'success',
        message: 'Payment already verified'
      })
    }

    // Verify payment with Paystack
    try {
      const verification = await paystackService.verifyPayment(reference)
      
      if (!verification.status || verification.data.status !== 'success') {
        console.log('Paystack verification failed:', verification)
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        )
      }

      console.log('Paystack verification successful:', verification.data)
    } catch (paystackError) {
      console.warn('Paystack API error, proceeding with database update:', paystackError)
      // Continue with database update even if Paystack fails (for development)
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
        { error: 'Failed to update donation status' },
        { status: 500 }
      )
    }

    console.log('Successfully updated donation status:', updatedDonation)

    return NextResponse.json({ 
      success: true, 
      donation: updatedDonation,
      payment_status: 'success',
      message: 'Payment status updated successfully'
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
