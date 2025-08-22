import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Check if Supabase is configured
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// GET - Fetch all programs
export async function GET() {
  try {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - returning empty programs')
      return NextResponse.json({ programs: [] })
    }

    const { data: programs, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching programs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch programs' },
        { status: 500 }
      )
    }

    return NextResponse.json({ programs })
  } catch (error) {
    console.error('Error in GET /api/programs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_url, category, status, start_date, end_date, location, max_participants } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 503 }
      )
    }

    const newProgram = {
      title,
      description: description || '',
      image_url: image_url || '',
      category: category || 'General',
      status: status || 'active',
      start_date: start_date || null,
      end_date: end_date || null,
      location: location || '',
      max_participants: max_participants || null
    }

    const { data: program, error } = await supabase
      .from('programs')
      .insert([newProgram])
      .select()
      .single()

    if (error) {
      console.error('Error creating program:', error)
      return NextResponse.json(
        { error: 'Failed to create program' },
        { status: 500 }
      )
    }

    return NextResponse.json({ program }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/programs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
