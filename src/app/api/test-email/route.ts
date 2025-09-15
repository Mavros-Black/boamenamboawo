import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendContactFormEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType = 'contact' } = body

    if (testType === 'contact') {
      // Test contact form email
      const result = await sendContactFormEmail({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Email Test',
        message: 'This is a test email to verify the email system is working correctly.'
      })

      return NextResponse.json({
        success: true,
        testType: 'contact',
        result,
        message: 'Contact form email test completed'
      })
    } else if (testType === 'simple') {
      // Test simple email
      const result = await sendEmail({
        to: process.env.TO_EMAIL || 'boamenameboawo@gmail.com',
        subject: 'Simple Email Test - Boa Me Youth Empowerment',
        text: 'This is a test email to verify the email system is working correctly.',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10B981;">Email Test - Boa Me Youth Empowerment</h2>
            <p>This is a test email to verify the email system is working correctly.</p>
            <p>If you receive this email, the system is functioning properly!</p>
            <br>
            <p style="color: #666;">Test sent at: ${new Date().toLocaleString()}</p>
          </div>
        `
      })

      return NextResponse.json({
        success: true,
        testType: 'simple',
        result,
        message: 'Simple email test completed'
      })
    }

    return NextResponse.json({
      error: 'Invalid test type. Use "contact" or "simple"'
    }, { status: 400 })

  } catch (error) {
    console.error('Email test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Email test failed'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    availableTests: ['contact', 'simple'],
    usage: 'POST with { "testType": "contact" } or { "testType": "simple" }',
    environment: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      fromEmail: process.env.FROM_EMAIL,
      toEmail: process.env.TO_EMAIL
    }
  })
}