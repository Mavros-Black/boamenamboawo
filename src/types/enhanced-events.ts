// Enhanced Event Types for Towaba-App Events System
// Phase 1: Multiple Ticket Types & Enhanced Event Details

export interface TicketType {
  id: string
  event_id: string
  name: string // 'Early Bird', 'Regular', 'VIP', 'Student'
  description?: string
  price: number
  original_price?: number // For showing discounts
  max_quantity: number // 0 = unlimited
  sold_quantity: number
  available_from: string
  available_until?: string
  benefits: string[]
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface EventSpeaker {
  id: string
  event_id: string
  name: string
  title?: string
  bio?: string
  image_url?: string
  linkedin_url?: string
  twitter_url?: string
  expertise_areas: string[]
  session_title?: string
  session_description?: string
  sort_order: number
  created_at: string
}

export interface AgendaItem {
  id: string
  event_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  session_type: 'session' | 'break' | 'networking' | 'keynote' | 'registration'
  speaker_id?: string
  speaker?: EventSpeaker
  location_details?: string
  is_mandatory: boolean
  max_attendees?: number
  sort_order: number
  created_at: string
}

export interface EventResource {
  id: string
  event_id: string
  title: string
  description?: string
  file_url?: string
  file_type: 'pdf' | 'video' | 'audio' | 'presentation' | 'spreadsheet'
  file_size?: number
  access_level: 'all' | 'premium' | 'vip'
  is_downloadable: boolean
  download_count: number
  sort_order: number
  created_at: string
}

export interface RegistrationQuestion {
  id: string
  event_id: string
  question: string
  question_type: 'text' | 'select' | 'multi_select' | 'boolean' | 'date'
  options?: string[]
  is_required: boolean
  sort_order: number
  created_at: string
}

export interface PromoCode {
  id: string
  event_id: string
  code: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  max_uses: number
  used_count: number
  valid_from: string
  valid_until?: string
  min_purchase_amount: number
  applicable_ticket_types: string[] // Array of ticket_type IDs
  is_active: boolean
  created_at: string
}

export interface GroupDiscountRule {
  id: string
  event_id: string
  name: string
  min_quantity: number
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  applicable_ticket_types: string[]
  is_active: boolean
}

// Enhanced Event interface
export interface EnhancedEvent {
  // Original event fields
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  venue: string
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  image_url?: string
  created_at: string
  updated_at: string
  
  // Enhanced fields
  ticket_types?: TicketType[]
  speakers?: EventSpeaker[]
  agenda?: AgendaItem[]
  resources?: EventResource[]
  registration_questions?: RegistrationQuestion[]
  promo_codes?: PromoCode[]
  group_discounts?: GroupDiscountRule[]
  
  // Computed fields
  min_price?: number
  max_price?: number
  total_tickets_available?: number
  early_bird_available?: boolean
  featured_speaker?: EventSpeaker
}

// Enhanced Ticket Purchase interface
export interface EnhancedTicketPurchase {
  id: string
  event_id: string
  ticket_type_id?: string
  ticket_type?: TicketType
  customer_name: string
  customer_email: string
  customer_phone?: string
  quantity: number
  total_amount: number
  original_amount?: number
  discount_amount: number
  promo_code_id?: string
  promo_code?: PromoCode
  payment_reference: string
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_status: 'pending' | 'success' | 'failed'
  registration_data?: Record<string, any>
  group_registration_id?: string
  special_requirements?: string
  verified_at?: string
  created_at: string
  updated_at: string
}

// Registration form data interface
export interface EventRegistrationData {
  // Customer info
  customer_name: string
  customer_email: string
  customer_phone?: string
  
  // Ticket selection
  selected_ticket_type: string
  quantity: number
  
  // Promo code
  promo_code?: string
  
  // Custom registration answers
  registration_answers: Record<string, any>
  
  // Special requirements
  special_requirements?: string
  
  // Group registration
  is_group_registration?: boolean
  group_size?: number
}

// Payment calculation interface
export interface PaymentCalculation {
  subtotal: number
  discount_amount: number
  promo_discount: number
  group_discount: number
  final_total: number
  breakdown: {
    ticket_type: string
    quantity: number
    unit_price: number
    line_total: number
  }[]
}

// Event analytics interface
export interface EventAnalytics {
  event_id: string
  total_registrations: number
  total_revenue: number
  registrations_by_ticket_type: Record<string, number>
  revenue_by_ticket_type: Record<string, number>
  daily_registrations: Record<string, number>
  promo_code_usage: Record<string, number>
  conversion_rate: number
  refund_rate: number
}

// API Response interfaces
export interface EventsApiResponse {
  events: EnhancedEvent[]
  total: number
  page: number
  limit: number
}

export interface EventDetailApiResponse {
  event: EnhancedEvent
  analytics?: EventAnalytics
}

export interface TicketPurchaseApiResponse {
  purchase: EnhancedTicketPurchase
  payment_calculation: PaymentCalculation
}

// Form validation interfaces
export interface EventFormErrors {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  selected_ticket_type?: string
  quantity?: string
  promo_code?: string
  registration_answers?: Record<string, string>
  special_requirements?: string
}

export interface PromoCodeValidation {
  valid: boolean
  error_message?: string
  discount_amount: number
  final_price: number
}