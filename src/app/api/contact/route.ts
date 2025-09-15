import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendContactFormEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, subject } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database if Supabase is configured
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          message
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating contact message:', error)
        return NextResponse.json(
          { error: 'Failed to create contact message' },
          { status: 500 }
        )
      }
    }

    // Send email notification
    try {
      const emailResult = await sendContactFormEmail({
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message
      })

      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error)
        // Continue with success response even if email fails
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Continue with success response even if email fails
    }

    return NextResponse.json({ 
      message: 'Contact form submitted successfully',
      success: true 
    })
  } catch (error) {
    console.error('Contact message creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching contact messages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contact messages' },
        { status: 500 }
      )
    }

    return NextResponse.json({ messages: data })
  } catch (error) {
    console.error('Contact message fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
