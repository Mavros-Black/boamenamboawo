import { NextRequest, NextResponse } from 'next/server'

// Mock donation data for demonstration
const mockDonations = [
  {
    id: '1',
    donor_name: 'John Doe',
    donor_email: 'john@example.com',
    amount: 100,
    message: 'Supporting youth education and empowerment',
    payment_status: 'success',
    created_at: '2024-01-15T10:30:00Z',
    payment_reference: 'BOA_ME_1705312200000',
    transaction_id: 'TXN_ABC123DEF'
  },
  {
    id: '2',
    donor_name: 'John Doe',
    donor_email: 'john@example.com',
    amount: 50,
    message: 'Keep up the great work!',
    payment_status: 'success',
    created_at: '2024-01-20T14:15:00Z',
    payment_reference: 'BOA_ME_1705756500000',
    transaction_id: 'TXN_XYZ789GHI'
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Receipt ID is required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would fetch from your database
    // For now, we'll use mock data
    const donation = mockDonations.find(d => d.id === id)

    if (!donation) {
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      receipt: donation
    })

  } catch (error) {
    console.error('Receipt fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
