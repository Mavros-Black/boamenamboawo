'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyPayment } from '@/lib/paystack'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('Verifying payment...')
  const [details, setDetails] = useState<any>(null)
  const [paymentType, setPaymentType] = useState<'shop' | 'donation' | 'unknown'>('unknown')

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

        // Verify the payment
        const verificationResult = await verifyPayment(paymentRef!)

        console.log('Payment verification result:', verificationResult)

        if (verificationResult.status && verificationResult.data.status === 'success') {
          setStatus('success')
          setDetails(verificationResult.data)
          
          // Determine if this is a shop order or donation based on reference prefix
          const isShopOrder = paymentRef?.startsWith('BOA_ME_SHOP_')
          const isDonation = paymentRef?.startsWith('BOA_ME_DONATION_')
          
          if (isShopOrder) {
            setMessage('Payment successful! Your order has been confirmed.')
            setPaymentType('shop')
            
            // Update order status in database
            try {
              const updateResponse = await fetch('/api/orders/update-status', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  reference: paymentRef,
                  status: 'success'
                })
              })

              if (!updateResponse.ok) {
                console.error('Failed to update order status:', await updateResponse.text())
              } else {
                console.log('Order status updated successfully')
              }
            } catch (error) {
              console.error('Failed to update order status:', error)
            }
          } else if (isDonation) {
            setMessage('Payment successful! Thank you for your donation.')
            setPaymentType('donation')
            
            // Update donation status in database
            try {
              const updateResponse = await fetch('/api/donations/update-status', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  reference: paymentRef,
                  status: 'success'
                })
              })

              if (!updateResponse.ok) {
                console.error('Failed to update donation status:', await updateResponse.text())
              } else {
                console.log('Donation status updated successfully')
              }
            } catch (error) {
              console.error('Failed to update donation status:', error)
            }
          } else {
            // Fallback for unknown payment types
            setMessage('Payment successful! Thank you for your support.')
            setPaymentType('unknown')
          }
        } else {
          setStatus('failed')
          setMessage(verificationResult.message || 'Payment verification failed')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
        setMessage('Payment verification failed. Please contact support.')
      }
    }

    verifyPaymentStatus()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {status === 'loading' && (
          <>
            <Loader className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="mt-4">
              {paymentType === 'shop' ? (
                <a 
                  href="/dashboard/orders" 
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  View My Orders
                </a>
              ) : paymentType === 'donation' ? (
                <a 
                  href="/donate" 
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Make Another Donation
                </a>
              ) : (
                <a 
                  href="/" 
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Return Home
                </a>
              )}
            </div>
            {details && (
              <div className="bg-green-50 p-4 rounded-md text-left">
                <p className="text-sm text-green-800">
                  <strong>Amount:</strong> ${(details.amount / 100).toFixed(2)}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Reference:</strong> {details.reference}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Date:</strong> {new Date(details.paidAt).toLocaleDateString()}
                </p>
              </div>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
            >
              Return to Home
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => window.location.href = '/donate'}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
