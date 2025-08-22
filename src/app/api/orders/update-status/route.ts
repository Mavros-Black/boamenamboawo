import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference, status } = body

    if (!reference || !status) {
      return NextResponse.json(
        { error: 'Reference and status are required' },
        { status: 400 }
      )
    }

    console.log('Updating order status:', { reference, status })

    // For now, just log the update since we're using mock data
    // In production, you would update the order in Supabase
    console.log(`Order with reference ${reference} status updated to ${status}`)

    return NextResponse.json({ 
      message: 'Order status updated successfully',
      reference,
      status 
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
