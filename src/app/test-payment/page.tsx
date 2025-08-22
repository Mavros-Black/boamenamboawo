'use client'

import { useState } from 'react'
import { initializePaystackPayment } from '@/lib/paystack'
import { paystackConfig, isTestMode } from '@/config/paystack'

export default function TestPaymentPage() {
  const [amount, setAmount] = useState('25')
  const [email, setEmail] = useState('test@example.com')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTestPayment = async () => {
    setLoading(true)
    setStatus('Initializing payment...')

    try {
      const reference = `TEST_PAYMENT_${Date.now()}`
      
      console.log('Payment config:', {
        publicKey: paystackConfig.publicKey,
        isTestMode: isTestMode(),
        amount,
        email,
        reference
      })

      const paymentData = await initializePaystackPayment(
        parseFloat(amount),
        email,
        reference,
        `${window.location.origin}/payment/callback`
      )

      console.log('Payment response:', paymentData)

      if (paymentData.status && paymentData.data.authorization_url) {
        setStatus('Payment initialized successfully! Redirecting...')
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url
      } else {
        setStatus(`Payment failed: ${paymentData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">Test Mode</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Use test card: 4084 0840 8408 4081 (Visa)
            </p>
          </div>

          <button
            onClick={handleTestPayment}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Test Payment'}
          </button>

          {status && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-700">{status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

