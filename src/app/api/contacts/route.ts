import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch all contacts
export async function GET() {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contacts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error in GET /api/contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const newContact = {
      name,
      email,
      message,
      status: 'unread'
    }

    const { data: contact, error } = await supabase
      .from('contacts')
      .insert([newContact])
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      return NextResponse.json(
        { error: 'Failed to create contact' },
        { status: 500 }
      )
    }

    return NextResponse.json({ contact }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

