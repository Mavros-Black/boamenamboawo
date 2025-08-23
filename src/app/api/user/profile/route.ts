import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, profileData } = body

    if (!email || !profileData) {
      return NextResponse.json(
        { error: 'Email and profile data are required' },
        { status: 400 }
      )
    }

    // First, get the user by email to get their ID
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError)
      return NextResponse.json(
        { error: 'Failed to find user' },
        { status: 500 }
      )
    }

    console.log('📧 Looking for user with email:', email)
    console.log('👥 Total users found:', users?.length || 0)
    
    // Find the user by email
    const user = users?.find(u => u.email === email)
    
    if (!user) {
      console.error('❌ User not found in list. Available emails:', users?.map(u => u.email))
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('✅ User found:', user.id)

    // Update user metadata in Supabase Auth using the correct user ID
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
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
