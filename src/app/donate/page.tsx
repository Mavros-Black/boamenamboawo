'use client'

import { useState } from 'react'
import { Heart, CreditCard, Smartphone, Shield, Users, Target, Award } from 'lucide-react'
import { initializePaystackPayment } from '@/lib/paystack'

export default function DonatePage() {
  const [donationAmount, setDonationAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorMessage, setDonorMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = [
    { value: '10', label: '₵10' },
    { value: '25', label: '₵25' },
    { value: '50', label: '₵50' },
    { value: '100', label: '₵100' },
    { value: '250', label: '₵250' },
    { value: '500', label: '₵500' },
  ]

  const impactExamples = [
    {
      amount: '₵25',
      impact: 'Provides school supplies for one student for a month',
      icon: '📚',
    },
    {
      amount: '₵50',
      impact: 'Funds a week of skills training for a youth',
      icon: '🛠️',
    },
    {
      amount: '₵100',
      impact: 'Supports a student\'s education for three months',
      icon: '🎓',
    },
    {
      amount: '₵250',
      impact: 'Helps launch a youth-led community project',
      icon: '🏘️',
    },
  ]

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = customAmount || donationAmount
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount.')
      return
    }

    if (!donorEmail) {
      alert('Please enter your email address.')
      return
    }

    // Handle anonymous donations or missing names
    const finalDonorName = isAnonymous ? 'Anonymous' : (donorName || 'Anonymous')

    setIsProcessing(true)

    try {
      // Generate unique reference for this donation
      const reference = `BOA_ME_DONATION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Create donation in Supabase
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donor_name: finalDonorName,
          donor_email: donorEmail,
          donor_message: donorMessage,
          amount: parseFloat(amount),
          payment_reference: reference,
          is_anonymous: isAnonymous
        })
      })

      if (!donationResponse.ok) {
        const errorData = await donationResponse.json()
        throw new Error(errorData.error || 'Failed to create donation')
      }
      
      // Initialize Paystack payment for donation
      const paymentData = await initializePaystackPayment(
        parseFloat(amount),
        donorEmail,
        reference,
        `${window.location.origin}/payment/callback`
      )

      if (paymentData.status && paymentData.data.authorization_url) {
        // Store donation details in localStorage for callback
        localStorage.setItem('donation_details', JSON.stringify({
          amount: parseFloat(amount),
          donorName: isAnonymous ? 'Anonymous' : donorName,
          donorEmail,
          donorMessage,
          reference
        }))
        
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url
      } else {
        throw new Error(paymentData.message || 'Payment initialization failed')
      }
    } catch (error) {
      console.error('Donation failed:', error)
      alert('Donation failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Make a Donation</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your donation directly supports our youth empowerment programs in Ghana. 
            Every contribution, no matter the size, makes a real difference.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Donate Now</h2>
              
              <form onSubmit={handleDonation} className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Donation Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => {
                          setDonationAmount(preset.value)
                          setCustomAmount('')
                        }}
                        className={`p-3 border rounded-md text-center transition-colors ${
                          donationAmount === preset.value
                            ? 'border-green-600 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₵</span>
                    <input
                      type="number"
                      placeholder="Or enter custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setDonationAmount('')
                      }}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                      Make this donation anonymous
                    </label>
                  </div>

                  {!isAnonymous && (
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}

                  <input
                    type="email"
                    placeholder="Your email address *"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <textarea
                    placeholder="Leave a message (optional)"
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Payment Methods */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Payment Methods</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Credit/Debit Cards</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-600">Mobile Money</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-xs text-gray-500">Secure payment powered by Paystack</span>
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-md font-medium text-white transition-colors ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Donation...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Donate Now
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Impact Information */}
            <div className="space-y-8">
              {/* Your Impact */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Impact</h3>
                <div className="space-y-4">
                  {impactExamples.map((example, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl">{example.icon}</div>
                      <div>
                        <div className="font-semibold text-green-800">{example.amount}</div>
                        <div className="text-sm text-gray-600">{example.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Donate */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Donate?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Direct Impact</h4>
                      <p className="text-sm text-gray-600">100% of your donation goes directly to youth programs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Target className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Measurable Results</h4>
                      <p className="text-sm text-gray-600">Track the impact of your donation through regular updates</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Sustainable Change</h4>
                      <p className="text-sm text-gray-600">Help build lasting positive change in communities</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transparency */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transparency & Accountability</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We believe in complete transparency. You&apos;ll receive regular updates on how your donation is being used 
                  and the impact it&apos;s making in the lives of young people.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Quarterly impact reports</li>
                  <li>• Financial transparency</li>
                  <li>• Direct communication from beneficiaries</li>
                  <li>• Tax-deductible receipts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact So Far</h2>
            <p className="text-xl text-gray-600">
              Thanks to generous donors like you, we&apos;ve been able to make a real difference.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$50K+</div>
              <div className="text-gray-600">Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Youth Empowered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Transparency</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
