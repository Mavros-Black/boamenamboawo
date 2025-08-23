import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Receipt ID is required' },
        { status: 400 }
      )
    }

    // Fetch donation from Supabase database
    const { data: donation, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !donation) {
      console.error('Error fetching donation:', error)
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      )
    }

    // Transform the donation data to match the receipt format
    const receipt = {
      id: donation.id,
      donor_name: donation.donor_name,
      donor_email: donation.donor_email,
      amount: donation.amount,
      message: donation.donor_message || '',
      payment_status: donation.payment_status,
      created_at: donation.created_at,
      payment_reference: donation.payment_reference,
      transaction_id: donation.payment_reference // Using payment_reference as transaction_id
    }

    return NextResponse.json({
      receipt: receipt
    })

  } catch (error) {
    console.error('Receipt fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
