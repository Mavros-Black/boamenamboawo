import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Mock orders data for development
const mockOrders = [
  {
    id: "1",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "+233 20 123 4567",
    customer_address: "123 Main Street",
    customer_city: "Accra",
    customer_state: "Greater Accra",
    customer_zip_code: "00233",
    customer_country: "Ghana",
    items: [
      {
        id: 1,
        name: "Boa Me Youth Empowerment T-Shirt",
        price: 25.00,
        quantity: 2
      }
    ],
    subtotal: 50.00,
    shipping: 5.00,
    total: 55.00,
    payment_reference: "ORDER_001",
    status: "completed",
    payment_status: "paid",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    customer_name: "Jane Smith",
    customer_email: "jane@example.com",
    customer_phone: "+233 24 987 6543",
    customer_address: "456 Oak Avenue",
    customer_city: "Kumasi",
    customer_state: "Ashanti",
    customer_zip_code: "00233",
    customer_country: "Ghana",
    items: [
      {
        id: 2,
        name: "Empower Youth Hoodie",
        price: 45.00,
        quantity: 1
      },
      {
        id: 3,
        name: "Youth Development Book",
        price: 15.00,
        quantity: 1
      }
    ],
    subtotal: 60.00,
    shipping: 5.00,
    total: 65.00,
    payment_reference: "ORDER_002",
    status: "pending",
    payment_status: "pending",
    created_at: "2024-01-20T14:15:00Z"
  },
  {
    id: "3",
    customer_name: "Kwame Asante",
    customer_email: "kwame@example.com",
    customer_phone: "+233 26 555 1234",
    customer_address: "789 Pine Road",
    customer_city: "Tamale",
    customer_state: "Northern",
    customer_zip_code: "00233",
    customer_country: "Ghana",
    items: [
      {
        id: 5,
        name: "Empowerment Bracelet",
        price: 8.00,
        quantity: 3
      }
    ],
    subtotal: 24.00,
    shipping: 5.00,
    total: 29.00,
    payment_reference: "ORDER_003",
    status: "processing",
    payment_status: "paid",
    created_at: "2024-01-25T09:45:00Z"
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customer_email, 
      customer_name, 
      customer_phone, 
      customer_address,
      customer_city,
      customer_state,
      customer_zip_code,
      customer_country,
      items, 
      subtotal, 
      shipping, 
      total, 
      payment_reference 
    } = body

    // Validate required fields
    if (!customer_email || !customer_name || !customer_phone || !customer_address || !items || !payment_reference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!supabase) {
      console.error('Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Save order to Supabase
    const orderData = {
      customer_email,
      customer_name,
      customer_phone,
      customer_address,
      customer_city: customer_city || '',
      customer_state: customer_state || '',
      customer_zip_code: customer_zip_code || '',
      customer_country: customer_country || 'Ghana',
      items,
      subtotal,
      shipping,
      total,
      payment_reference,
      status: 'pending',
      payment_status: 'pending'
    }

    console.log('Inserting order data:', orderData)

    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    
    return NextResponse.json({ order })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const admin = searchParams.get('admin')

    if (!supabase) {
      console.error('Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    // If user_id is provided, filter by customer email
    if (user_id) {
      query = query.eq('customer_email', user_id)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
