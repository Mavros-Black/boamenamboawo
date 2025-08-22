import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test connection by trying to query the donations table
    const { data, error } = await supabase
      .from('donations')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database test error:', error)
      return NextResponse.json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection successful',
      tables: ['donations', 'orders', 'contact_messages', 'newsletter_subscriptions']
    })

  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

