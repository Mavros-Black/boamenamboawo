import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('donations')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Supabase connection failed', details: error },
        { status: 500 }
      )
    }

    console.log('Supabase connection successful')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      data: data
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error },
      { status: 500 }
    )
  }
}

