import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Donation request body:', body)
    
    const { 
      donor_name, 
      donor_email, 
      donor_message, 
      amount, 
      payment_reference,
      is_anonymous 
    } = body

    // Validate required fields
    if (!donor_name || !donor_email || !amount || !payment_reference) {
      console.log('Validation failed:', { donor_name, donor_email, amount, payment_reference })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create donation in Supabase
    const { data, error } = await supabase
      .from('donations')
      .insert({
        donor_name: is_anonymous ? 'Anonymous' : donor_name,
        donor_email,
        donor_message: donor_message || '',
        amount,
        payment_reference,
        payment_status: 'pending',
        is_anonymous: is_anonymous || false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating donation:', error)
      return NextResponse.json(
        { error: 'Failed to create donation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ donation: data })
  } catch (error) {
    console.error('Donation creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching donations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch donations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ donations: data })
  } catch (error) {
    console.error('Donation fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
