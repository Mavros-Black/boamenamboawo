import { NextRequest, NextResponse } from 'next/server'
import { paystackService } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Paystack initialization request:', body)
    
    const { amount, email, reference, callback_url, metadata } = body

    // Validate required fields
    if (!amount || !email || !reference) {
      console.log('Paystack validation failed:', { amount, email, reference })
      return NextResponse.json(
        { error: 'Missing required fields: amount, email, reference' },
        { status: 400 }
      )
    }

    // Initialize payment with Paystack
    const paymentData = {
      amount,
      email,
      reference,
      callback_url: callback_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      metadata: metadata || {},
    }

    const response = await paystackService.initializePayment(paymentData)

    if (!response.status) {
      return NextResponse.json(
        { error: response.message || 'Payment initialization failed' },
        { status: 400 }
      )
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Paystack initialization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
