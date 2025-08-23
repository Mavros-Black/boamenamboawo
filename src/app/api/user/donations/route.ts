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

    // Fetch donations for the specific user
    const { data: donations, error } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_email', userEmail)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user donations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch donations' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const transformedDonations = donations?.map(donation => ({
      id: donation.id,
      amount: donation.amount,
      payment_status: donation.payment_status || 'pending',
      created_at: donation.created_at,
      message: donation.message
    })) || []

    return NextResponse.json({ donations: transformedDonations })
  } catch (error) {
    console.error('User donations fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
