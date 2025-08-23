'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: { id: string; name: string; price: number; image: string; category: string }) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  mergeGuestCart: () => void
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
      // Guest cart - load from localStorage
      const guestCart = localStorage.getItem('guest_cart')
      if (guestCart) {
        try {
          setCartItems(JSON.parse(guestCart))
        } catch (error) {
          console.error('Error loading guest cart from localStorage:', error)
        }
      } else {
        setCartItems([])
      }
    }
  }, [user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const cartKey = `cart_${user.id}`
      localStorage.setItem(cartKey, JSON.stringify(cartItems))
    } else {
      // Save guest cart
      localStorage.setItem('guest_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, user])

  const addToCart = (product: { id: string; name: string; price: number; image: string; category: string }) => {
    console.log('CartContext: addToCart called with:', product)
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // If item exists, increase quantity
        console.log('CartContext: Updating existing item quantity')
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // If item doesn't exist, add new item
        console.log('CartContext: Adding new item to cart')
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

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
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

  const mergeGuestCart = () => {
    const guestCart = localStorage.getItem('guest_cart')
    if (guestCart && user) {
      try {
        const guestItems = JSON.parse(guestCart)
        setCartItems(prevItems => {
          // Merge guest items with existing user cart items
          const mergedItems = [...prevItems]
          
          guestItems.forEach((guestItem: CartItem) => {
            const existingItem = mergedItems.find(item => item.id === guestItem.id)
            if (existingItem) {
              existingItem.quantity += guestItem.quantity
            } else {
              mergedItems.push(guestItem)
            }
          })
          
          return mergedItems
        })
        
        // Clear guest cart after merging
        localStorage.removeItem('guest_cart')
      } catch (error) {
        console.error('Error merging guest cart:', error)
      }
    }
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
      mergeGuestCart,
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
