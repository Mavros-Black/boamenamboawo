import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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



    if (!supabase) {
      console.error('Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Update order status in Supabase
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: status,
        payment_status: status === 'completed' ? 'success' : 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('payment_reference', reference)
      .select()

    if (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }


    return NextResponse.json({ 
      message: 'Order status updated successfully',
      reference,
      status,
      order: data?.[0]
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
