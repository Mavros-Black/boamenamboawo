import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create contact message in Supabase
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

    return NextResponse.json({ message: data })
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
