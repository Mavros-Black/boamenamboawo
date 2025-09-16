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

    const { data: programs, error } = await supabase!
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

    // Ensure status is one of the allowed values
    const validatedPrograms = programs.map(program => ({
      ...program,
      status: ['active', 'inactive', 'completed'].includes(program.status) 
        ? program.status 
        : 'active'
    }))

    return NextResponse.json({ programs: validatedPrograms })
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
    const { title, description, image_url, category, status, start_date, end_date, location, max_participants, current_participants } = body

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
      max_participants: max_participants || null,
      current_participants: current_participants || 0
    }

    const { data: program, error } = await supabase!
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

// PUT - Update an existing program
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, image_url, category, status, start_date, end_date, location, max_participants, current_participants } = body

    // Validate required fields - only ID is required for updates
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 503 }
      )
    }

    // Only require title for new programs, not updates
    const updatedProgram: any = {
      updated_at: new Date().toISOString()
    }

    // Add fields to update only if they are provided
    if (title !== undefined) updatedProgram.title = title
    if (description !== undefined) updatedProgram.description = description
    if (image_url !== undefined) updatedProgram.image_url = image_url
    if (category !== undefined) updatedProgram.category = category
    if (status !== undefined) updatedProgram.status = status
    if (start_date !== undefined) updatedProgram.start_date = start_date
    if (end_date !== undefined) updatedProgram.end_date = end_date
    if (location !== undefined) updatedProgram.location = location
    if (max_participants !== undefined) updatedProgram.max_participants = max_participants
    if (current_participants !== undefined) updatedProgram.current_participants = current_participants

    const { data: program, error } = await supabase!
      .from('programs')
      .update(updatedProgram)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating program:', error)
      return NextResponse.json(
        { error: 'Failed to update program' },
        { status: 500 }
      )
    }

    return NextResponse.json({ program })
  } catch (error) {
    console.error('Error in PUT /api/programs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a program
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase environment variables.' },
        { status: 503 }
      )
    }

    const { error } = await supabase!
      .from('programs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting program:', error)
      return NextResponse.json(
        { error: 'Failed to delete program' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Program deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/programs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}