'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Lock, User, CreditCard, Truck, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [checkoutStep, setCheckoutStep] = useState<'login' | 'shipping' | 'payment' | 'confirmation'>('login')

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setCheckoutStep('login')
      } else if (cartItems.length === 0) {
        router.push('/shop')
      } else {
        setCheckoutStep('shipping')
      }
    }
  }, [user, loading, cartItems, router])

  const handleLoginRedirect = () => {
    router.push('/auth/login?redirect=checkout')
  }

  const handleRegisterRedirect = () => {
    router.push('/auth/register?redirect=checkout')
  }

  const handlePlaceOrder = () => {
    // Simulate order placement
    setCheckoutStep('confirmation')
    clearCart()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (cartItems.length === 0 && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some products to your cart to continue shopping.</p>
          <Link
            href="/shop"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${checkoutStep === 'login' ? 'text-green-600' : 'text-gray-400'}`}>
              <Lock className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Login</span>
            </div>
            <div className={`flex items-center ${checkoutStep === 'shipping' ? 'text-green-600' : 'text-gray-400'}`}>
              <Truck className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className={`flex items-center ${checkoutStep === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
              <CreditCard className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className={`flex items-center ${checkoutStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {checkoutStep === 'login' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center mb-6">
                  <Lock className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                  <p className="text-gray-600">
                    Please login or create an account to complete your purchase.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Login to Existing Account
                  </button>
                  
                  <button
                    onClick={handleRegisterRedirect}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Create New Account
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Don't worry, your cart items will be saved and merged with your account.
                  </p>
                </div>
              </div>
            )}

            {checkoutStep === 'shipping' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                </form>
              </div>
            )}

            {checkoutStep === 'confirmation' && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. Your order has been successfully placed.
                </p>
                <Link
                  href="/shop"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-medium">$5.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm font-medium">${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(cartTotal + 5 + cartTotal * 0.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
