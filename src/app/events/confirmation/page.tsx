'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Mail, Calendar, MapPin, Ticket, ArrowLeft } from 'lucide-react'

interface Purchase {
  id: string
  event_id: string
  customer_name: string
  customer_email: string
  quantity: number
  total_amount: number
  payment_reference: string
  status: string
  created_at: string
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  venue: string
}

function TicketConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get('reference')
  
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reference) {
      setError('No payment reference found')
      setLoading(false)
      return
    }

    fetchPurchaseDetails()
  }, [reference])

  const fetchPurchaseDetails = async () => {
    try {
      setLoading(true)
      
      // In a real implementation, you would fetch from your API
      // For now, we'll simulate the data
      const mockPurchase: Purchase = {
        id: '1',
        event_id: 'youth-leadership-summit-2024',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        quantity: 2,
        total_amount: 150,
        payment_reference: reference!,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }

      const mockEvent: Event = {
        id: 'youth-leadership-summit-2024',
        title: 'Youth Leadership Summit 2024',
        date: '2024-11-15',
        time: '09:00 AM - 05:00 PM',
        venue: 'Accra International Conference Centre'
      }

      setPurchase(mockPurchase)
      setEvent(mockEvent)
    } catch (error) {
      console.error('Error fetching purchase details:', error)
      setError('Failed to load purchase details')
    } finally {
      setLoading(false)
    }
  }

  const generateTicketPDF = () => {
    // In a real implementation, this would generate and download a PDF ticket
    alert('PDF ticket generation would be implemented here')
  }

  const sendEmailConfirmation = () => {
    // In a real implementation, this would trigger an email
    alert('Email confirmation would be sent here')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmation details...</p>
        </div>
      </div>
    )
  }

  if (error || !purchase || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirmation Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Purchase details not found.'}</p>
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Your tickets have been confirmed. Check your email for details.
          </p>
        </div>

        {/* Purchase Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Reference Number:</span>
              <span className="font-medium text-gray-900">{purchase.payment_reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium text-gray-900">{purchase.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{purchase.customer_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Tickets:</span>
              <span className="font-medium text-gray-900">{purchase.quantity}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-gray-900">Total Paid:</span>
              <span className="font-bold text-green-600">GH₵{purchase.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(event.date).toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Tickets</h2>
          <p className="text-gray-600 mb-4">
            Your tickets are ready! You can download them as a PDF or have them sent to your email.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generateTicketPDF}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Tickets
            </button>
            <button
              onClick={sendEmailConfirmation}
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Tickets
            </button>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notes</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• Please bring a valid ID and your ticket (printed or digital) to the event</li>
            <li>• Tickets are non-refundable but transferable</li>
            <li>• Doors open 30 minutes before the scheduled start time</li>
            <li>• For any questions, contact us at events@boame.org</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            href="/events"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function TicketConfirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmation details...</p>
        </div>
      </div>
    }>
      <TicketConfirmationContent />
    </Suspense>
  )
}