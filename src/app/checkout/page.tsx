'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { initializePaystackPayment } from '@/lib/paystack'
import { ArrowLeft, ShoppingCart, CreditCard, Smartphone, Shield, MapPin, Mail, User, Phone } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, cartTotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Ghana'
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/shop')
    }
  }, [cartItems, router])

  const shipping = cartTotal > 0 ? 5.00 : 0
  const total = cartTotal + shipping

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']
    for (const field of required) {
      if (!customerDetails[field as keyof typeof customerDetails]) {
        alert(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    
    if (!customerDetails.email.includes('@')) {
      alert('Please enter a valid email address')
      return false
    }
    
    return true
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsProcessing(true)
    
    try {
      // Generate unique reference for this transaction
      const reference = `BOA_ME_SHOP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create order in Supabase
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_email: customerDetails.email,
          customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
          customer_phone: customerDetails.phone,
          customer_address: customerDetails.address,
          customer_city: customerDetails.city,
          customer_state: customerDetails.state,
          customer_zip_code: customerDetails.zipCode,
          customer_country: customerDetails.country,
          items: cartItems,
          subtotal: cartTotal,
          shipping,
          total,
          payment_reference: reference
        })
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      // Store order details in localStorage for callback
      localStorage.setItem('order_details', JSON.stringify({
        items: cartItems,
        customer: customerDetails,
        total,
        reference
      }))

      // Initialize Paystack payment
      const paymentData = await initializePaystackPayment(
        total,
        customerDetails.email,
        reference,
        `${window.location.origin}/payment/callback`
      )

      if (paymentData.status && paymentData.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url
      } else {
        throw new Error(paymentData.message || 'Payment initialization failed')
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some products to your cart to continue with checkout.</p>
          <Link
            href="/shop"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/shop"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Shop
              </Link>
            </div>
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-green-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">Checkout</span>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
              
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerDetails.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={customerDetails.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Region
                        </label>
                        <input
                          type="text"
                          value={customerDetails.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          value={customerDetails.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          value={customerDetails.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Ghana">Ghana</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
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

                {/* Place Order Button */}
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
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Place Order - ${total.toFixed(2)}
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Impact Message */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Your Purchase Makes a Difference</h3>
                <p className="text-sm text-green-700">
                  Every purchase from our shop directly supports our youth empowerment programs in Ghana. 
                  Thank you for helping us build brighter futures!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
