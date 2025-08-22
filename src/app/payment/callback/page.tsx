'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { verifyPayment } from '@/lib/paystack'

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        const reference = searchParams.get('reference')
        const trxref = searchParams.get('trxref')

        if (!reference && !trxref) {
          setStatus('failed')
          setMessage('No payment reference found')
          return
        }

        const paymentRef = reference || trxref

        if (paymentRef) {
          // Verify the payment with Paystack
          const verificationResult = await verifyPayment(paymentRef)

          if (verificationResult.status && verificationResult.data.status === 'success') {
            setStatus('success')
            setMessage('Payment completed successfully!')
            // Clear cart after successful payment
            clearCart()
          } else {
            setStatus('failed')
            setMessage('Payment verification failed or payment was not successful')
          }
        } else {
          setStatus('failed')
          setMessage('Invalid payment reference')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
        setMessage('Error verifying payment. Please contact support.')
      }
    }

    verifyPaymentStatus()
  }, [searchParams, clearCart])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-green-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'success' ? (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/shop"
                className="block w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/dashboard"
                className="block w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="block w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Try Again
              </Link>
              <Link
                href="/shop"
                className="block w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Shop
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
