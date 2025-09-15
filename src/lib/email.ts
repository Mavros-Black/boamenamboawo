import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string
  subject: string
  text?: string
  html?: string
  from?: string
}

export async function sendEmail(data: EmailData) {
  try {
    // Ensure we have at least text content for Resend API
    const emailPayload: any = {
      from: data.from || process.env.FROM_EMAIL || 'Boa Me <noreply@yourdomain.com>',
      to: data.to,
      subject: data.subject,
    }

    // Add text content if provided, otherwise use a plain text version of HTML or default
    if (data.text) {
      emailPayload.text = data.text
    } else if (data.html) {
      // If only HTML is provided, create a simple text version
      emailPayload.text = data.html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    } else {
      // Fallback text if neither is provided
      emailPayload.text = 'This email requires HTML support to display properly.'
    }

    // Add HTML content if provided
    if (data.html) {
      emailPayload.html = data.html
    }

    const result = await resend.emails.send(emailPayload)

    return { success: true, data: result }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendContactFormEmail(formData: {
  name: string
  email: string
  subject?: string
  message: string
}) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #10B981; color: white; padding: 20px; text-align: center;">
        <h1>New Contact Form Submission</h1>
        <p>Boa Me Youth Empowerment Website</p>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #1f2937;">Contact Details</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${formData.subject ? `<p><strong>Subject:</strong> ${formData.subject}</p>` : ''}
        
        <h3 style="color: #1f2937; margin-top: 30px;">Message</h3>
        <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #10B981;">
          ${formData.message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #1e40af;">
            <strong>Reply to:</strong> ${formData.email}<br>
            <strong>Received:</strong> ${new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' })} (Ghana Time)
          </p>
        </div>
      </div>
    </div>
  `

  const emailText = `
New Contact Form Submission - Boa Me Youth Empowerment

Name: ${formData.name}
Email: ${formData.email}
${formData.subject ? `Subject: ${formData.subject}` : ''}

Message:
${formData.message}

Reply to: ${formData.email}
Received: ${new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' })} (Ghana Time)
  `

  return await sendEmail({
    to: process.env.TO_EMAIL || 'boamenameboawo@gmail.com',
    subject: `New Contact: ${formData.subject || 'General Inquiry'} - ${formData.name}`,
    html: emailHtml,
    text: emailText,
  })
}

export async function sendNewsletterConfirmation(email: string) {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #10B981; color: white; padding: 20px; text-align: center;">
        <h1>Welcome to Boa Me Newsletter!</h1>
        <p>Thank you for subscribing</p>
      </div>
      
      <div style="padding: 20px;">
        <p>Dear Supporter,</p>
        <p>Thank you for subscribing to the Boa Me Youth Empowerment newsletter! You'll now receive updates about:</p>
        
        <ul style="color: #374151;">
          <li>Youth empowerment programs and success stories</li>
          <li>Upcoming events and volunteer opportunities</li>
          <li>Impact reports and how your support makes a difference</li>
          <li>Ways to get involved in our mission</li>
        </ul>
        
        <p>We're excited to have you as part of our community working to empower youth in Ghana!</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #10B981; font-weight: bold;">Together, we build futures!</p>
        </div>
      </div>
    </div>
  `

  return await sendEmail({
    to: email,
    subject: 'Welcome to Boa Me Youth Empowerment Newsletter',
    html: emailHtml,
  })
}