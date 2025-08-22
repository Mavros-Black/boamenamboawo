import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscriptions')
      .select('id')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      )
    }

    // Create newsletter subscription in Supabase
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating newsletter subscription:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscriber: data })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching newsletter subscribers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch newsletter subscribers' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscribers: data })
  } catch (error) {
    console.error('Newsletter subscribers fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
