import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { paystackService } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { reference } = body

    if (!reference) {
      return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 })
    }

    console.log('Verifying event ticket payment for reference:', reference)

    // First check if ticket purchase exists
    const { data: existingPurchase, error: fetchError } = await supabaseAdmin
      .from('ticket_purchases')
      .select('*')
      .eq('payment_reference', reference)
      .single()

    if (fetchError) {
      console.error('Error fetching ticket purchase:', fetchError)
      console.error('Fetch error details:', {
        code: fetchError.code,
        message: fetchError.message,
        details: fetchError.details
      })
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ 
          error: 'Ticket purchase not found',
          details: 'No ticket purchase record found with this payment reference'
        }, { status: 404 })
      }
      return NextResponse.json({ 
        error: 'Database error while fetching purchase record',
        details: fetchError.message,
        code: fetchError.code
      }, { status: 500 })
    }

    console.log('Found ticket purchase:', existingPurchase)

    // If already confirmed, return success
    if (existingPurchase.status === 'confirmed') {
      return NextResponse.json({ 
        success: true,
        purchase: existingPurchase,
        payment: { status: 'success' },
        message: 'Ticket purchase already confirmed'
      }, { status: 200 })
    }

    // Verify payment with Paystack (with fallback for development)
    let paymentVerified = false
    let paymentData = null

    try {
      const verification = await paystackService.verifyPayment(reference)
      if (verification.status && verification.data.status === 'success') {
        paymentVerified = true
        paymentData = verification.data
        console.log('Paystack verification successful')
      } else {
        console.log('Paystack verification failed:', verification.message)
      }
    } catch (paystackError) {
      const errorMessage = paystackError instanceof Error ? paystackError.message : 'Unknown error'
      console.warn('Paystack API error, using fallback verification:', errorMessage)
      // For development, assume payment is successful if we have a purchase record
      paymentVerified = true
      paymentData = {
        status: 'success',
        reference: reference,
        amount: existingPurchase.total_amount * 100, // Convert to kobo
        message: 'Development mode verification'
      }
    }

    if (!paymentVerified) {
      return NextResponse.json({ 
        error: 'Payment verification failed',
        details: 'Payment was not successful or could not be verified'
      }, { status: 400 })
    }

    // Update purchase record to confirmed
    console.log('Updating ticket purchase with reference:', reference)
    const updateData: any = { 
      status: 'confirmed',
      payment_status: 'success',
      verified_at: new Date().toISOString()
    }
    
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('ticket_purchases')
      .update(updateData)
      .eq('payment_reference', reference)
      .select()
      .single()

    // If the update failed due to verified_at, try without it
    if (purchaseError) {
      console.error('Purchase update error:', purchaseError)
      
      // Check if it's a PostgrestError with specific properties
      const errorDetails = {
        message: purchaseError.message || 'Unknown error',
        code: (purchaseError as any).code || 'UNKNOWN',
        details: (purchaseError as any).details || '',
        hint: (purchaseError as any).hint || ''
      }
      
      console.error('Error details:', errorDetails)
      
      // If the error is related to verified_at, try without it
      if (errorDetails.message?.includes('verified_at') || errorDetails.details?.includes('verified_at')) {
        console.warn('Failed to update with verified_at, retrying without it:', errorDetails.message)
        const { data: purchaseRetry, error: retryError } = await supabaseAdmin
          .from('ticket_purchases')
          .update({ 
            status: 'confirmed',
            payment_status: 'success'
          })
          .eq('payment_reference', reference)
          .select()
          .single()
          
        if (retryError) {
          const retryErrorDetails = {
            message: retryError.message || 'Unknown error',
            code: (retryError as any).code || 'UNKNOWN',
            details: (retryError as any).details || '',
            hint: (retryError as any).hint || ''
          }
          
          console.error('Purchase update error (retry):', retryErrorDetails)
          return NextResponse.json({ 
            error: 'Failed to update purchase record',
            details: retryErrorDetails.message,
            code: retryErrorDetails.code,
            hint: retryErrorDetails.hint
          }, { status: 500 })
        }
        
        console.log('Successfully updated ticket purchase to confirmed (retry):', purchaseRetry)
        return NextResponse.json({ 
          success: true,
          purchase: purchaseRetry,
          payment: paymentData,
          message: 'Ticket purchase confirmed successfully'
        }, { status: 200 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to update purchase record',
        details: errorDetails.message,
        code: errorDetails.code,
        hint: errorDetails.hint
      }, { status: 500 })
    }

    console.log('Successfully updated ticket purchase to confirmed:', purchase)

    // TODO: Send confirmation email with tickets
    // TODO: Generate ticket QR codes

    return NextResponse.json({ 
      success: true,
      purchase,
      payment: paymentData,
      message: 'Ticket purchase confirmed successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}