import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendNewsletterConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save to database if Supabase is configured
    if (supabase) {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('newsletter_subscriptions')
        .select('id')
        .eq('email', email)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        )
      }

      // Insert new subscription
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email })
        .select()
        .single()

      if (error) {
        console.error('Error creating newsletter subscription:', error)
        return NextResponse.json(
          { error: 'Failed to subscribe to newsletter' },
          { status: 500 }
        )
      }
    }

    // Send confirmation email
    try {
      const emailResult = await sendNewsletterConfirmation(email)
      if (!emailResult.success) {
        console.error('Confirmation email failed:', emailResult.error)
        // Continue with success response even if email fails
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Continue with success response even if email fails
    }

    return NextResponse.json({ 
      message: 'Successfully subscribed to newsletter',
      success: true 
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching newsletter subscriptions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscriptions: data })
  } catch (error) {
    console.error('Newsletter fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}