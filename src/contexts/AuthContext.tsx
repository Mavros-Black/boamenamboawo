'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, AuthUser } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: { name?: string; role?: 'admin' | 'user' }) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...')
        
        // Check if Supabase is configured
        if (!supabase) {
          console.warn('⚠️ Supabase not configured - using mock auth')
          setLoading(false)
          return
        }
        
        const { data: { session } } = await supabase.auth.getSession()
        console.log('📡 Initial session:', session ? 'Found' : 'Not found')
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email!,
            user_metadata: session.user.user_metadata,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at
          }
          console.log('✅ Setting user from initial session:', authUser.email)
          setUser(authUser)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes only if Supabase is configured
    let subscription: any = null
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event, session?.user?.email)
          
          if (session?.user) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email!,
              user_metadata: session.user.user_metadata,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at
            }
            console.log('✅ Setting user from auth state change:', authUser.email)
            setUser(authUser)
          } else {
            console.log('❌ Clearing user from auth state change')
            setUser(null)
          }
          setLoading(false)
        }
      )
      subscription = data.subscription
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email)
      
      // If Supabase is not configured, return mock success for demo purposes
      if (!supabase) {
        console.warn('⚠️ Supabase not configured - using mock login')
        return { 
          success: false, 
          error: 'Authentication service not configured. Please set up environment variables.' 
        }
      }


      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ Login error:', error)
        return { success: false, error: error.message }
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at
        }
        console.log('✅ Login successful for:', authUser.email)
        setUser(authUser)
        
        // Merge guest cart with user cart after successful login
        setTimeout(() => {
          const guestCart = localStorage.getItem('guest_cart')
          if (guestCart) {
            try {
              const guestItems = JSON.parse(guestCart)
              const userCartKey = `cart_${authUser.id}`
              const existingUserCart = localStorage.getItem(userCartKey)
              
              if (existingUserCart) {
                const userItems = JSON.parse(existingUserCart)
                const mergedItems = [...userItems]
                
                guestItems.forEach((guestItem: any) => {
                  const existingItem = mergedItems.find((item: any) => item.id === guestItem.id)
                  if (existingItem) {
                    existingItem.quantity += guestItem.quantity
                  } else {
                    mergedItems.push(guestItem)
                  }
                })
                
                localStorage.setItem(userCartKey, JSON.stringify(mergedItems))
              } else {
                localStorage.setItem(userCartKey, guestCart)
              }
              
              // Clear guest cart after merging
              localStorage.removeItem('guest_cart')
              console.log('🛒 Guest cart merged with user cart')
            } catch (error) {
              console.error('Error merging guest cart:', error)
            }
          }
        }, 100)
        
        return { success: true, user: authUser }
      }

      return { success: false, error: 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      console.log('📝 Attempting registration for:', email)
      

      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user' // Default role for new users
          }
        }
      })

      if (error) {
        console.error('❌ Registration error:', error)
        return { success: false, error: error.message }
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at
        }
        console.log('✅ Registration successful for:', authUser.email)
        setUser(authUser)
        
        // Merge guest cart with user cart after successful registration
        setTimeout(() => {
          const guestCart = localStorage.getItem('guest_cart')
          if (guestCart) {
            try {
              const guestItems = JSON.parse(guestCart)
              const userCartKey = `cart_${authUser.id}`
              
              // For new users, just move the guest cart to user cart
              localStorage.setItem(userCartKey, guestCart)
              
              // Clear guest cart after merging
              localStorage.removeItem('guest_cart')
              console.log('🛒 Guest cart moved to new user cart')
            } catch (error) {
              console.error('Error merging guest cart:', error)
            }
          }
        }, 100)
        
        return { success: true, user: authUser }
      }

      return { success: false, error: 'Registration failed' }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      console.log('🚪 Attempting logout...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Logout error:', error)
      } else {
        console.log('✅ Logout successful')
      }
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('🔑 Attempting password reset for:', email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        console.error('❌ Password reset error:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Password reset email sent to:', email)
      return { success: true }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: 'Password reset failed. Please try again.' }
    }
  }

  const updateProfile = async (updates: { name?: string; role?: 'admin' | 'user' }) => {
    try {
      console.log('👤 Attempting profile update:', updates)
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) {
        console.error('❌ Profile update error:', error)
        return { success: false, error: error.message }
      }

      if (data.user && user) {
        const updatedUser: AuthUser = {
          ...user,
          user_metadata: { ...user.user_metadata, ...updates }
        }
        console.log('✅ Profile update successful')
        setUser(updatedUser)
      }

      return { success: true }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Profile update failed. Please try again.' }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
