'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit form to Supabase
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `${formData.subject ? `Subject: ${formData.subject}\n\n` : ''}${formData.message}`
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }
      
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Form submission failed:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@boamenameboawo.com',
      description: 'Send us an email anytime',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+233 XX XXX XXXX',
      description: 'Mon-Fri from 8am to 6pm',
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'Accra, Ghana',
      description: 'West Africa',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Monday - Friday',
      description: '8:00 AM - 6:00 PM GMT',
    },
  ]

  const faqs = [
    {
      question: 'How can I volunteer with Boa Me?',
      answer: 'We welcome volunteers! Please contact us through the form above or email us directly. We have opportunities in teaching, mentoring, administrative support, and community outreach.',
    },
    {
      question: 'How do I know my donation is being used effectively?',
      answer: 'We provide quarterly impact reports and financial transparency documents. You can also request specific information about how your donation is being used.',
    },
    {
      question: 'Can I sponsor a specific youth or program?',
      answer: 'Yes! We offer sponsorship programs where you can support specific youth or programs. Contact us to learn more about our sponsorship opportunities.',
    },
    {
      question: 'How can my organization partner with Boa Me?',
      answer: 'We actively seek partnerships with organizations that share our vision. Please reach out to discuss potential collaboration opportunities.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
                         Get in touch with us. We&apos;d love to hear from you and answer any questions 
             you might have about our work and how you can get involved.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Volunteer Opportunity">Volunteer Opportunity</option>
                      <option value="Donation Question">Donation Question</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Program Information">Program Information</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-md font-medium text-white transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </div>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <info.icon className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{info.title}</h4>
                        <p className="text-gray-600 font-medium">{info.value}</p>
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map integration coming soon</p>
                  <p className="text-sm text-gray-400">Accra, Ghana</p>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <span className="text-sm font-semibold">f</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                  >
                    <span className="text-sm font-semibold">t</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                  >
                    <span className="text-sm font-semibold">ig</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <span className="text-sm font-semibold">yt</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our organization and programs.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about our programs, 
            success stories, and ways to get involved.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button className="bg-green-800 hover:bg-green-900 px-6 py-3 rounded-r-md font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
