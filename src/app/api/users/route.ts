import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get users from Supabase Auth instead of custom users table
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const transformedUsers = users?.map(user => ({
      id: user.id,
      name: user.user_metadata?.name || 'User',
      email: user.email,
      role: user.user_metadata?.role || 'user',
      created_at: user.created_at
    })) || []

    return NextResponse.json({ users: transformedUsers })
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

