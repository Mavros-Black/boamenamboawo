import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/roleAuth'
// import { supabase } from '@/lib/supabase' // Commented out for now

// Mock user data for demonstration - using same data as auth API
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+233 20 123 4567",
    address: "123 Main Street",
    city: "Accra",
    state: "Greater Accra",
    zipCode: "00233",
    country: "Ghana",
    role: "user",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    name: "Admin User",
    email: "admin@example.com",
    phone: "+233 24 987 6543",
    address: "456 Oak Avenue",
    city: "Kumasi",
    state: "Ashanti",
    zipCode: "00233",
    country: "Ghana",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z"
  }
]

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const user = (request as { user: { role: string; userId: string } }).user

    // Users can only access their own profile, admins can access any profile
    if (user.role !== 'admin' && user.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find user in mock data
    const profileUser = mockUsers.find(u => u.id === userId)

    if (!profileUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user: profileUser })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { userId, profileData } = body
    const user = (request as { user: { role: string; userId: string } }).user

    console.log('🔍 Profile update request:', {
      requestedUserId: userId,
      authenticatedUser: user,
      availableUsers: mockUsers.map(u => ({ id: u.id, email: u.email }))
    })

    // Users can only update their own profile, admins can update any profile
    if (user.role !== 'admin' && user.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    if (!userId || !profileData) {
      return NextResponse.json(
        { error: 'User ID and profile data are required' },
        { status: 400 }
      )
    }

    // Find user in mock data
    const userIndex = mockUsers.findIndex(u => u.id === userId)

    console.log('🔍 User lookup result:', {
      requestedUserId: userId,
      userIndex,
      foundUser: userIndex !== -1 ? mockUsers[userIndex] : null
    })

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user profile
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...profileData,
      updated_at: new Date().toISOString()
    }

    console.log('Profile updated successfully:', mockUsers[userIndex])

    return NextResponse.json({
      success: true,
      user: mockUsers[userIndex],
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
