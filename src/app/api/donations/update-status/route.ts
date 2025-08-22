import { NextRequest, NextResponse } from 'next/server'

// Mock database for testing - replace with actual Supabase in production
const mockDonations = [
  {
    id: "4563634e-9b39-4778-9d50-467e948e3241",
    donor_name: "Anonymous",
    donor_email: "kusi@exam.com",
    amount: 100,
    payment_reference: "BOA_ME_DONATION_1755783743734_2hzj5dny5",
    payment_status: "pending",
    created_at: "2025-08-21T13:42:25.389951+00:00"
  },
  {
    id: "3723477e-7d03-4051-9f62-dd2fb6ce669b",
    donor_name: "Test Auth",
    donor_email: "test@auth.com",
    amount: 15,
    payment_reference: "AUTH_TEST_001",
    payment_status: "pending",
    created_at: "2025-08-21T12:36:19.838413+00:00"
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference, status } = body

    if (!reference || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: reference, status' },
        { status: 400 }
      )
    }

    console.log('Updating donation status:', { reference, status })

    // Find the donation in mock data
    const existingDonation = mockDonations.find(d => d.payment_reference === reference)

    if (!existingDonation) {
      console.error('Donation not found for reference:', reference)
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    // Update the payment status
    existingDonation.payment_status = status
    existingDonation.updated_at = new Date().toISOString()

    console.log('Successfully updated donation status:', existingDonation)

    return NextResponse.json({ 
      success: true, 
      donation: existingDonation,
      message: 'Donation status updated successfully'
    })
  } catch (error) {
    console.error('Donation status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
