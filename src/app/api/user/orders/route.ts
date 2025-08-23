import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('email')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      )
    }

    // Fetch orders for the specific user
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', userEmail)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      items: order.items || [],
      total: order.total,
      status: order.status || 'pending',
      created_at: order.created_at
    })) || []

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error('User orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
