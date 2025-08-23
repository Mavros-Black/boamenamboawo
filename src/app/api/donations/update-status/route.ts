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

    // Update donation status in Supabase
    const { data, error } = await supabase
      .from('donations')
      .update({ 
        payment_status: status
      })
      .eq('payment_reference', reference)
      .select()
      .single()

    if (error) {
      console.error('Error updating donation status:', error)
      return NextResponse.json(
        { error: 'Failed to update donation status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      donation: data 
    })
  } catch (error) {
    console.error('Donation status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
