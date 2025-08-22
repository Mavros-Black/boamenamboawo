'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { verifyPayment } from '@/lib/paystack'

function PaymentCallbackContent() {
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
          console.log('Verifying payment for reference:', paymentRef)
          
          // Verify the payment with Paystack
          const verificationResult = await verifyPayment(paymentRef)

          if (verificationResult.status && verificationResult.data.status === 'success') {
            console.log('Payment verification successful')
            setStatus('success')
            setMessage('Payment completed successfully!')
            
            // Create order in database
            try {
              // Get order data from localStorage
              const pendingOrderData = localStorage.getItem('pending_order')
              let orderData
              
              if (pendingOrderData) {
                const savedOrder = JSON.parse(pendingOrderData)
                orderData = {
                  customer_email: verificationResult.data.customer.email,
                  customer_name: `${savedOrder.shippingInfo.firstName} ${savedOrder.shippingInfo.lastName}`,
                  customer_phone: verificationResult.data.customer.phone,
                  customer_address: savedOrder.shippingInfo.address,
                  customer_city: savedOrder.shippingInfo.city,
                  customer_state: savedOrder.shippingInfo.state,
                  customer_zip_code: savedOrder.shippingInfo.zipCode,
                  customer_country: 'Ghana',
                  items: savedOrder.cartItems,
                  subtotal: savedOrder.subtotal,
                  shipping: savedOrder.shipping,
                  total: savedOrder.total,
                  payment_reference: paymentRef
                }
                // Clear pending order data
                localStorage.removeItem('pending_order')
              } else {
                // Fallback if no saved order data
                orderData = {
                  customer_email: verificationResult.data.customer.email,
                  customer_name: `${verificationResult.data.customer.first_name} ${verificationResult.data.customer.last_name}`,
                  customer_phone: verificationResult.data.customer.phone,
                  customer_address: 'Address not available',
                  customer_city: 'City not available',
                  customer_state: 'State not available',
                  customer_zip_code: 'ZIP not available',
                  customer_country: 'Ghana',
                  items: [],
                  subtotal: verificationResult.data.amount / 100,
                  shipping: 5.00,
                  total: verificationResult.data.amount / 100,
                  payment_reference: paymentRef
                }
              }

              console.log('Creating order with data:', orderData)

              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
              })

              if (orderResponse.ok) {
                console.log('Order created successfully')
                
                // Update order status to completed
                const statusResponse = await fetch('/api/orders/update-status', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    reference: paymentRef,
                    status: 'completed'
                  })
                })

                if (statusResponse.ok) {
                  console.log('Order status updated successfully')
                } else {
                  console.error('Failed to update order status')
                }
              } else {
                console.error('Failed to create order')
              }
            } catch (error) {
              console.error('Error creating order:', error)
            }
            
            // Clear cart after successful payment
            clearCart()
          } else {
            console.log('Payment verification failed:', verificationResult)
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

    // Only run once when component mounts
    if (status === 'loading') {
      verifyPaymentStatus()
    }
  }, []) // Remove dependencies to prevent infinite loops

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

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-green-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
