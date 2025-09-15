'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { verifyPayment } from '@/lib/paystack'

function PaymentCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { user } = useAuth()

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
          
          // Check payment type from metadata or localStorage
          const donationData = localStorage.getItem('donation_details')
          const pendingOrderData = localStorage.getItem('pending_order')
          const isEventTicket = verificationResult.data.metadata?.custom_fields?.some(
            (field: any) => field.variable_name === 'event_ticket' && field.value === 'true'
          )
          
          if (isEventTicket) {
            // Handle event ticket payment
            try {
              // Update ticket purchase status using dedicated endpoint
              const ticketResponse = await fetch('/api/events/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  reference: paymentRef
                })
              })

              if (ticketResponse.ok) {
                const ticketData = await ticketResponse.json()
                
                // Redirect to ticket confirmation page
                setTimeout(() => {
                  router.push(`/events/confirmation?reference=${paymentRef}`)
                }, 2000)
              } else {
                const ticketError = await ticketResponse.json()
              }
            } catch (error) {
            }
          } else if (donationData) {
            // Handle donation payment
            try {
              const donation = JSON.parse(donationData)
              
              // Update donation status to success based on Paystack response
              const donationResponse = await fetch('/api/donations/update-status', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  reference: paymentRef,
                  status: 'success'
                })
              })

              const donationResult = await donationResponse.json()

              if (donationResponse.ok) {
                // Clear donation data
                localStorage.removeItem('donation_details')
                
                // Redirect to donation receipt
                setTimeout(() => {
                  router.push(`/dashboard/user/receipt/${donation.donationId}`)
                }, 2000)
              } else {
                // Set error status but don't block the flow completely
                setStatus('failed')
                setMessage(`Failed to update donation status: ${donationResult.error || 'Unknown error'}`)
              }
            } catch (error) {
              setStatus('failed')
              setMessage('Error processing donation payment. Please contact support.')
            }
          } else if (pendingOrderData) {
            // Handle order payment
            try {
              const savedOrder = JSON.parse(pendingOrderData)
              const orderData = {
                customer_email: user?.email || verificationResult.data.customer.email,
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

              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
              })

              if (orderResponse.ok) {
                const orderResult = await orderResponse.json()
                
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
                } else {
                  const statusError = await statusResponse.json()
                }
              } else {
                const orderError = await orderResponse.json()
                throw new Error(`Failed to create order: ${orderError.error || 'Unknown error'}`)
              }
              
              // Clear pending order data
              localStorage.removeItem('pending_order')
              // Clear cart after successful payment
              clearCart()
            } catch (error) {
            }
          }
        } else {
          setStatus('failed')
          setMessage('Payment verification failed or payment was not successful')
        }
      } else {
        setStatus('failed')
        setMessage('Invalid payment reference')
      }
    } catch (error) {
      setStatus('failed')
      setMessage('An error occurred while verifying your payment. Please contact support.')
    }
  }

  verifyPaymentStatus()
}, [searchParams, router, clearCart, user])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <div>
            <Loader2 className="mx-auto h-12 w-12 text-green-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-sm text-green-800">
                You will be redirected shortly. If you are not redirected, please click the button below.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue to Homepage
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div>
            <XCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Return to Homepage
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Contact Support
              </Link>
            </div>
          </div>
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