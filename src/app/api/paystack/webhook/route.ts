import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { paystackConfig } from '@/config/paystack'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      console.error('Supabase client not configured')
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    // Verify webhook signature
    if (!signature) {
      console.error('No Paystack signature found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the signature
    const hash = crypto
      .createHmac('sha512', paystackConfig.secretKey)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      console.error('Invalid Paystack signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    console.log('Paystack webhook event:', event)

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data)
        break
      case 'charge.failed':
        await handleFailedPayment(event.data)
        break
      default:
        console.log('Unhandled event type:', event.event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleSuccessfulPayment(data: { reference: string; amount: number; status: string; paidAt?: string }) {
  try {
    const { reference, amount, status, paidAt } = data

    console.log('Processing successful payment:', { reference, amount, status })

    if (!supabase) {
      throw new Error('Supabase client not configured')
    }

    // Update donation status in database
    const { data: donation, error } = await supabase
      .from('donations')
      .update({ 
        payment_status: 'success'
      })
      .eq('payment_reference', reference)
      .select()
      .single()

    if (error) {
      console.error('Error updating donation status:', error)
      throw error
    }

    console.log('Donation status updated successfully:', donation)
  } catch (error) {
    console.error('Failed to handle successful payment:', error)
    throw error
  }
}

async function handleFailedPayment(data: { reference: string; status: string }) {
  try {
    const { reference, status } = data

    console.log('Processing failed payment:', { reference, status })

    if (!supabase) {
      throw new Error('Supabase client not configured')
    }

    // Update donation status in database
    const { data: donation, error } = await supabase
      .from('donations')
      .update({ 
        payment_status: 'failed'
      })
      .eq('payment_reference', reference)
      .select()
      .single()

    if (error) {
      console.error('Error updating donation status:', error)
      throw error
    }

    console.log('Donation status updated to failed:', donation)
  } catch (error) {
    console.error('Failed to handle failed payment:', error)
    throw error
  }
}
