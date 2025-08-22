'use client'

import { useState } from 'react'
import { initializePaystackPayment } from '@/lib/paystack'

export default function TestPaymentFlowPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState('')

  const testCompleteFlow = async () => {
    setLoading(true)
    setStatus('Starting payment flow...')

    try {
      // Step 1: Initialize payment
      const testReference = `TEST_FLOW_${Date.now()}`
      setReference(testReference)
      
      setStatus('Initializing payment...')
      
      const paymentData = await initializePaystackPayment(
        25, // 25 GHS
        'test@example.com',
        testReference,
        `${window.location.origin}/payment/callback`
      )

      console.log('Payment initialization result:', paymentData)

      if (paymentData.status && paymentData.data.authorization_url) {
        setStatus('Payment initialized! Redirecting to payment page...')
        
        // Step 2: Simulate payment completion by directly calling callback
        setTimeout(async () => {
          setStatus('Simulating payment completion...')
          
          try {
            // Call the callback directly
            const callbackUrl = `${window.location.origin}/payment/callback?reference=${testReference}`
            console.log('Calling callback URL:', callbackUrl)
            
            // Open callback in new window to test
            window.open(callbackUrl, '_blank')
            
            setStatus('Payment callback opened in new window. Check the new window for results.')
          } catch (error) {
            console.error('Callback error:', error)
            setStatus(`Callback error: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }, 2000)
      } else {
        setStatus(`Payment initialization failed: ${paymentData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Payment flow error:', error)
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testStatusUpdate = async () => {
    if (!reference) {
      setStatus('No reference available. Please start a payment flow first.')
      return
    }

    setLoading(true)
    setStatus('Testing status update...')

    try {
      const response = await fetch('/api/donations/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: reference,
          status: 'success'
        })
      })

      const result = await response.json()
      console.log('Status update result:', result)

      if (response.ok) {
        setStatus(`Status update successful: ${result.message}`)
      } else {
        setStatus(`Status update failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Status update error:', error)
      setStatus(`Status update error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Payment Flow Test
        </h1>

        <div className="space-y-4">
          <button
            onClick={testCompleteFlow}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Testing...' : 'Test Complete Payment Flow'}
          </button>

          <button
            onClick={testStatusUpdate}
            disabled={loading || !reference}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Test Status Update
          </button>

          {reference && (
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="text-sm text-gray-600">Reference: {reference}</p>
            </div>
          )}

          {status && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800">{status}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>This test will:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Initialize a payment</li>
            <li>Open the callback page in a new window</li>
            <li>Test the status update API</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

