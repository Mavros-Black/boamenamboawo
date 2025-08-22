'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { initializePaystackPayment, verifyPayment } from '@/lib/paystack'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}



export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart()

  const removeItem = (itemId: number) => {
    removeFromCart(itemId)
  }

  const subtotal = cartTotal
  const shipping = subtotal > 0 ? 5.00 : 0
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    setIsProcessing(true)
    
    try {
      // Generate unique reference for this transaction
      const reference = `BOA_ME_SHOP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Validate customer email
      if (!customerEmail || !customerEmail.includes('@')) {
        alert('Please enter a valid email address to continue with checkout.')
        return
      }

      // Initialize Paystack payment
      const paymentData = await initializePaystackPayment(
        total, // Total amount including shipping
        customerEmail,
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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <p className="text-gray-400">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Customer Email */}
            <div>
              <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="customer-email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter your email for receipt"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="w-full py-3 px-4 rounded-md font-medium transition-colors bg-green-600 hover:bg-green-700 text-white text-center block"
              >
                Continue to Checkout
              </Link>
              
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors text-sm ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Quick Checkout'
                )}
              </button>
            </div>

            {/* Payment Methods */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Secure payment powered by</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Paystack
                </div>
                <span className="text-xs text-gray-500">Cards • Mobile Money</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
