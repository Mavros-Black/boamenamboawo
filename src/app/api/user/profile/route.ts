import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, profileData } = body

    console.log('Profile update request:', { email, profileData })

    if (!email || !profileData) {
      return NextResponse.json(
        { error: 'Email and profile data are required' },
        { status: 400 }
      )
    }

    // First, get the user by email to get their ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json(
        { error: 'Failed to find user' },
        { status: 500 }
      )
    }

    // Find the user by email
    const user = users?.find(u => u.email === email)
    
    console.log('User lookup result:', { 
      requestedEmail: email, 
      foundUser: user ? { id: user.id, email: user.email } : null,
      totalUsers: users?.length 
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user metadata in Supabase Auth using the correct user ID
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
          country: profileData.country
        }
      }
    )

    if (error) {
      console.error('Error updating user profile:', error)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: data.user 
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
