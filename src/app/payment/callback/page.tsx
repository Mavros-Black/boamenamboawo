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
        console.log('Verifying payment for reference:', paymentRef)
        
        // Verify the payment with Paystack
        const verificationResult = await verifyPayment(paymentRef)

        if (verificationResult.status && verificationResult.data.status === 'success') {
          console.log('Payment verification successful:', verificationResult)
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
              console.log('Processing event ticket payment:', paymentRef)
              
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
                console.log('Ticket purchase confirmed successfully:', ticketData)
                
                // Redirect to ticket confirmation page
                setTimeout(() => {
                  router.push(`/events/confirmation?reference=${paymentRef}`)
                }, 2000)
              } else {
                const ticketError = await ticketResponse.json()
                console.error('Failed to confirm ticket purchase:', ticketError)
              }
            } catch (error) {
              console.error('Error processing ticket purchase:', error)
            }
          } else if (donationData) {
            // Handle donation payment
            try {
              const donation = JSON.parse(donationData)
              console.log('Processing donation payment:', donation)
              
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

              console.log('Donation update response status:', donationResponse.status)
              const donationResult = await donationResponse.json()
              console.log('Donation update response data:', donationResult)

              if (donationResponse.ok) {
                console.log('Donation status updated successfully')
                // Clear donation data
                localStorage.removeItem('donation_details')
                
                // Redirect to donation receipt
                setTimeout(() => {
                  router.push(`/dashboard/user/receipt/${donation.donationId}`)
                }, 2000)
              } else {
                console.error('Failed to update donation status:', donationResult)
                // Set error status but don't block the flow completely
                setStatus('failed')
                setMessage(`Failed to update donation status: ${donationResult.error || 'Unknown error'}`)
              }
            } catch (error) {
              console.error('Error processing donation:', error)
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
              
              console.log('Creating order with data:', orderData)

              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
              })

              if (orderResponse.ok) {
                const orderResult = await orderResponse.json()
                console.log('Order created successfully:', orderResult)
                
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
                  const statusError = await statusResponse.json()
                  console.error('Failed to update order status:', statusError)
                }
              } else {
                const orderError = await orderResponse.json()
                console.error('Failed to create order:', orderError)
                throw new Error(`Failed to create order: ${orderError.error || 'Unknown error'}`)
              }
              
              // Clear pending order data
              localStorage.removeItem('pending_order')
              // Clear cart after successful payment
              clearCart()
            } catch (error) {
              console.error('Error creating order:', error)
            }
          }
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
                href="/events"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Events
              </Link>
              <Link
                href="/dashboard/user"
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
                href="/events"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Events
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
