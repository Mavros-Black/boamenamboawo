'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Heart, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { initializePaystackPayment } from '@/lib/paystack'

export default function DashboardDonatePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [donationStatus, setDonationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Form state with auto-populated user data
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    amount: '',
    message: '',
    isAnonymous: false
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Auto-populate form with user data
    setFormData(prev => ({
      ...prev,
      donorName: user.name || user.first_name + ' ' + user.last_name || '',
      donorEmail: user.email || ''
    }))
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setDonationStatus('processing')
    setErrorMessage('')

    try {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      // Generate unique reference
      const reference = `BOA_ME_DONATION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Create donation record
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donor_name: formData.isAnonymous ? 'Anonymous' : formData.donorName,
          donor_email: formData.donorEmail,
          amount: amount,
          message: formData.message,
          payment_reference: reference,
          payment_status: 'pending'
        })
      })

      if (!donationResponse.ok) {
        const errorData = await donationResponse.json()
        throw new Error(errorData.error || 'Failed to create donation')
      }

      // Initialize Paystack payment
      const paymentData = await initializePaystackPayment(
        amount,
        formData.donorEmail,
        reference,
        `${window.location.origin}/payment/callback`
      )

      if (paymentData.status && paymentData.data.authorization_url) {
        setDonationStatus('success')
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url
      } else {
        throw new Error(paymentData.message || 'Failed to initialize payment')
      }
    } catch (error) {
      console.error('Donation error:', error)
      setDonationStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const presetAmounts = [10, 25, 50, 100, 250, 500]

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Heart className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Donation</h1>
        <p className="text-gray-600 text-lg">
          Your contribution helps us empower more young people in Ghana
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">₵15,420</div>
          <div className="text-gray-600">Total Raised This Year</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">247</div>
          <div className="text-gray-600">Donors This Year</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
          <div className="text-gray-600">Youth Empowered</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation Details</h2>
          
          <form onSubmit={handleDonation} className="space-y-6">
            {/* Donor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleInputChange}
                  required
                  disabled={formData.isAnonymous}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="donorEmail"
                  value={formData.donorEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>
            </div>

            {/* Donation Amount */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Donation Amount</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (GHS) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      ₵{amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Share why you're making this donation..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || donationStatus === 'processing'}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Donate Now
                </>
              )}
            </button>
          </form>

          {/* Status Messages */}
          {donationStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800">Redirecting to payment gateway...</span>
              </div>
            </div>
          )}

          {donationStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{errorMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Impact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">₵25 provides school supplies for one student</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">₵50 funds a week of skills training</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">₵100 supports a month of mentorship</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-700">₵250 enables a complete leadership program</span>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Donation</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-gray-700">SSL encrypted payment processing</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">Paystack secure payment gateway</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-gray-700">PCI DSS compliant</span>
              </div>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Anonymous</span>
                <span className="font-semibold text-green-600">₵100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sarah M.</span>
                <span className="font-semibold text-green-600">₵50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">John D.</span>
                <span className="font-semibold text-green-600">₵250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Anonymous</span>
                <span className="font-semibold text-green-600">₵75</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

