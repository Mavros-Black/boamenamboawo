'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: { id: number; name: string; price: number; image: string; category: string }) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (user) {
      // User-specific cart key
      const cartKey = `cart_${user.id}`
      const savedCart = localStorage.getItem(cartKey)
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      } else {
        setCartItems([])
      }
    } else {
      // Clear cart when no user is logged in
      setCartItems([])
    }
  }, [user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const cartKey = `cart_${user.id}`
      localStorage.setItem(cartKey, JSON.stringify(cartItems))
    }
  }, [cartItems, user])

  const addToCart = (product: { id: number; name: string; price: number; image: string; category: string }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // If item doesn't exist, add new item
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          category: product.category
        }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
