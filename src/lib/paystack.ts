// Paystack API configuration and utilities

export interface PaystackConfig {
  publicKey: string
  secretKey: string
  baseUrl: string
}

export interface PaymentData {
  amount: number // Amount in kobo (smallest currency unit)
  email: string
  reference: string
  callback_url?: string
  metadata?: Record<string, unknown>
}

export interface PaymentResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface VerificationResponse {
  status: boolean
  message: string
  data: {
    amount: number
    currency: string
    transaction_date: string
    status: string
    reference: string
    domain: string
    metadata: Record<string, unknown>
    gateway_response: string
    message: string
    channel: string
    ip_address: string
    log: unknown
    fees: number
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
      account_name: string
    }
    customer: {
      id: number
      first_name: string
      last_name: string
      email: string
      customer_code: string
      phone: string
      metadata: Record<string, unknown>
      risk_action: string
      international_format_phone: string
    }
    plan: unknown
    split: unknown
    order_id: unknown
    paidAt: string
    createdAt: string
    updatedAt: string
  }
}

import { paystackConfig } from '@/config/paystack'

class PaystackService {
  private config: PaystackConfig

  constructor() {
    this.config = {
      publicKey: paystackConfig.publicKey,
      secretKey: paystackConfig.secretKey,
      baseUrl: paystackConfig.baseUrl,
    }
  }

  // Initialize payment transaction
  async initializePayment(paymentData: PaymentData): Promise<PaymentResponse> {
    const response = await fetch(`${this.config.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Verify payment transaction
  async verifyPayment(reference: string): Promise<VerificationResponse> {
    const response = await fetch(`${this.config.baseUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.secretKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Create customer
  async createCustomer(email: string, firstName?: string, lastName?: string) {
    const response = await fetch(`${this.config.baseUrl}/customer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
      }),
    })

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Get public key for client-side integration
  getPublicKey(): string {
    return this.config.publicKey
  }

  // Generate unique reference
  generateReference(): string {
    return `BOA_ME_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Convert amount to kobo (Paystack uses kobo as the smallest currency unit)
  convertToKobo(amount: number): number {
    return Math.round(amount * 100)
  }

  // Convert kobo to naira
  convertFromKobo(amount: number): number {
    return amount / 100
  }
}

export const paystackService = new PaystackService()

// Client-side Paystack integration
export const initializePaystackPayment = async (
  amount: number,
  email: string,
  reference: string,
  callbackUrl?: string
) => {
  try {
    const response = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paystackService.convertToKobo(amount),
        email,
        reference,
        callback_url: callbackUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to initialize payment')
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

// Verify payment on client side
export const verifyPayment = async (reference: string) => {
  try {
    const response = await fetch(`/api/paystack/verify?reference=${reference}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to verify payment')
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}
