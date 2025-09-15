'use client'

import { useState } from 'react'
import { paystackService } from '@/lib/paystack'

interface PaystackButtonProps {
  amount: number
  email: string
  onSuccess: (reference: string) => void
  onClose: () => void
  disabled?: boolean
  children: React.ReactNode
  metadata?: Record<string, unknown>
}

export default function PaystackButton({
  amount,
  email,
  onSuccess,
  onClose,
  disabled = false,
  children,
  metadata = {}
}: PaystackButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true)
      
      // Generate unique reference
      const reference = paystackService.generateReference()
      
      // Initialize payment
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paystackService.convertToKobo(amount),
          email,
          reference,
          metadata: {
            ...metadata,
            custom_fields: [
              {
                display_name: 'Event Ticket Purchase',
                variable_name: 'event_ticket',
                value: 'true'
              }
            ]
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to initialize payment')
      }

      const data = await response.json()
      
      if (data.status) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url
      } else {
        throw new Error(data.message || 'Payment initialization failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment initialization failed. Please try again.')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={`${
        disabled || loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } w-full py-3 px-4 rounded-lg font-semibold transition-colors`}
    >
      {loading ? 'Initializing Payment...' : children}
    </button>
  )
}