import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference parameter is required' },
        { status: 400 }
      )
    }

    console.log('Verifying payment for reference:', reference)

    // Mock payment verification - in production, this would call Paystack API
    // For now, we'll assume all payments are successful
    const mockResponse = {
      status: true,
      message: 'Payment verified successfully',
      data: {
        amount: 2500, // 25.00 in kobo
        currency: 'NGN',
        transaction_date: new Date().toISOString(),
        status: 'success',
        reference: reference,
        domain: 'test',
        metadata: {},
        gateway_response: 'Successful',
        message: 'Payment successful',
        channel: 'card',
        ip_address: '127.0.0.1',
        log: null,
        fees: 0,
        authorization: {
          authorization_code: 'AUTH_TEST',
          bin: '408408',
          last4: '4081',
          exp_month: '12',
          exp_year: '2030',
          channel: 'card',
          card_type: 'visa',
          bank: 'TEST BANK',
          country_code: 'NG',
          brand: 'visa',
          reusable: true,
          signature: 'SIG_TEST',
          account_name: 'Test User'
        },
        customer: {
          id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          customer_code: 'CUS_TEST',
          phone: '08012345678',
          metadata: {},
          risk_action: 'default',
          international_format_phone: '+2348012345678'
        },
        plan: null,
        split: null,
        order_id: null,
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    console.log('Payment verification successful:', mockResponse)

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Paystack verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
