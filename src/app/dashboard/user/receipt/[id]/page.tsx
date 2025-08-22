'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { 
  Heart, 
  CheckCircle, 
  Download, 
  Share2, 
  ArrowLeft,
  Calendar,
  CreditCard,
  User
} from 'lucide-react'

interface DonationReceipt {
  id: string
  donor_name: string
  donor_email: string
  amount: number
  message?: string
  payment_status: 'success' | 'pending' | 'failed'
  created_at: string
  payment_reference: string
  transaction_id?: string
}

export default function DonationReceiptPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchReceipt()
  }, [user, router, params.id])

  const fetchReceipt = async () => {
    try {
      const response = await fetch(`/api/donations/receipt/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch receipt')
      }

      const data = await response.json()
      setReceipt(data.receipt)
    } catch (error) {
      console.error('Error fetching receipt:', error)
      setError('Failed to load receipt')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount)
  }

  const handleDownloadReceipt = () => {
    if (!receipt) return

    // Create receipt content
    const receiptContent = `
BOA ME Youth Empowerment
Donation Receipt

Receipt ID: ${receipt.id}
Date: ${formatDate(receipt.created_at)}
Transaction ID: ${receipt.transaction_id}

Donor Information:
Name: ${receipt.donor_name}
Email: ${receipt.donor_email}

Donation Details:
Amount: ${formatAmount(receipt.amount)}
Status: ${receipt.payment_status.toUpperCase()}
Reference: ${receipt.payment_reference}

Message: ${receipt.message || 'No message provided'}

Thank you for your generous donation!
Your support helps us empower youth in Ghana.

For questions, contact: support@boame.org
    `.trim()

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donation-receipt-${receipt.id}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleShareReceipt = () => {
    if (navigator.share && receipt) {
      navigator.share({
        title: 'My Donation Receipt - BOA ME Youth Empowerment',
        text: `I just donated ${formatAmount(receipt.amount)} to BOA ME Youth Empowerment!`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Receipt link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Receipt Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested receipt could not be found.'}</p>
          <button
            onClick={() => router.push('/dashboard/user')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/user')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Successful!</h1>
            <p className="text-gray-600">Thank you for your generous contribution</p>
          </div>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">BOA ME Youth Empowerment</h2>
                <p className="text-green-100">Donation Receipt</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{formatAmount(receipt.amount)}</div>
                <div className="text-green-100 text-sm">Donation Amount</div>
              </div>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-700">{formatDate(receipt.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-700">Transaction ID: {receipt.transaction_id}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-green-600 font-medium">Payment Successful</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-700">{receipt.donor_name}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-gray-700">{receipt.donor_email}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-red-500 mr-3" />
                    <span className="text-gray-700">Reference: {receipt.payment_reference}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            {receipt.message && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 italic">"{receipt.message}"</p>
                </div>
              </div>
            )}

            {/* Impact */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Heart className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Thank you for your support!</span>
                </div>
                <p className="text-green-700 text-sm">
                  Your donation of {formatAmount(receipt.amount)} will help us continue our mission 
                  of empowering youth in Ghana through education, skills training, and community development.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadReceipt}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </button>
                <button
                  onClick={handleShareReceipt}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Receipt
                </button>
                <button
                  onClick={() => router.push('/dashboard/user?tab=donate')}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Make Another Donation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Email Confirmation</h4>
              <p className="text-sm text-gray-600">You'll receive a detailed email confirmation shortly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Fund Allocation</h4>
              <p className="text-sm text-gray-600">Your donation will be allocated to youth programs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Impact Updates</h4>
              <p className="text-sm text-gray-600">Stay tuned for updates on how your donation helps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
