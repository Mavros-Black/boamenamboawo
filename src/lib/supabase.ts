import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Check if Supabase is properly configured
const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
}) : null

// Admin client for server-side operations
export const supabaseAdmin = isSupabaseConfigured ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
}) : null

// Supabase Auth Types
export type AuthUser = {
  id: string
  email: string
  user_metadata?: {
    name?: string
    role?: 'admin' | 'user'
  }
  created_at: string
  updated_at: string
}

// Database types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id?: string
  customer_email: string
  customer_name: string
  customer_phone: string
  customer_address: string
  items: any[]
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  payment_reference: string
  payment_status: 'pending' | 'success' | 'failed'
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_name: string
  donor_email: string
  donor_message?: string
  amount: number
  payment_reference: string
  payment_status: 'pending' | 'success' | 'failed'
  is_anonymous: boolean
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export interface Newsletter {
  id: string
  email: string
  created_at: string
}
