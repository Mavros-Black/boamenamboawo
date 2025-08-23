'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/Toast'
import { initializePaystackPayment } from '@/lib/paystack'
import { 
  User, 
  ShoppingCart, 
  Heart, 
  Target, 
  Settings, 
  Edit, 
  Eye, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface UserOrder {
  id: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  created_at: string
}

interface UserDonation {
  id: string
  amount: number
  payment_status: 'pending' | 'success' | 'failed'
  created_at: string
  message?: string
}

interface UserProgram {
  id: string
  title: string
  category: string
  start_date: string
  end_date: string
  status: 'enrolled' | 'completed' | 'dropped'
  progress: number
}

export default function UserDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [userOrders, setUserOrders] = useState<UserOrder[]>([])
  const [userDonations, setUserDonations] = useState<UserDonation[]>([])
  const [userPrograms, setUserPrograms] = useState<UserProgram[]>([])
  const [editProfile, setEditProfile] = useState(false)
  const loadingRef = useRef(false)
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
    city: user?.user_metadata?.city || '',
    state: user?.user_metadata?.state || '',
    zipCode: user?.user_metadata?.zipCode || '',
    country: user?.user_metadata?.country || 'Ghana'
  })

  // Donation state
  const [donationLoading, setDonationLoading] = useState(false)
  const [donationStatus, setDonationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [donationError, setDonationError] = useState('')
  const [donationForm, setDonationForm] = useState({
    donorName: user?.user_metadata?.name || '',
    donorEmail: user?.email || '',
    amount: '',
    message: '',
    isAnonymous: false
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    // Set active tab from URL parameter
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'orders', 'donations', 'donate', 'programs', 'profile'].includes(tab)) {
      setActiveTab(tab)
    }
    
    // Update donation form with user data
    setDonationForm(prev => ({
      ...prev,
      donorName: user.user_metadata?.name || '',
      donorEmail: user.email || ''
    }))
    
    // Always load data for new user sessions
    if (user.email && !loadingRef.current) {
      console.log('Loading user data for:', user.email)
      setDataLoaded(false) // Reset data loaded state for new user
      loadUserData()
    }
  }, [user, searchParams, router])

  // Reset data loaded state when user logs out
  useEffect(() => {
    if (!user) {
      setDataLoaded(false)
      setLoading(false)
      loadingRef.current = false
      setUserOrders([])
      setUserDonations([])
      setUserPrograms([])
    }
  }, [user])

  const loadUserData = async () => {
    // Prevent multiple simultaneous calls using ref
    if (loadingRef.current) {
      console.log('Already loading, skipping...')
      return
    }
    
    // Set loading state at the start
    loadingRef.current = true
    setLoading(true)
    
    try {
      if (!user?.email) {
        console.error('No user email available')
        return
      }

      // Load real data from API endpoints
      const [ordersResponse, donationsResponse] = await Promise.all([
        fetch(`/api/user/orders?email=${encodeURIComponent(user.email)}`),
        fetch(`/api/user/donations?email=${encodeURIComponent(user.email)}`)
      ])

      // Load orders
      if (ordersResponse.ok) {
        const { orders } = await ordersResponse.json()
        setUserOrders(orders || [])
      } else {
        console.error('Failed to load orders')
        setUserOrders([])
      }

      // Load donations
      if (donationsResponse.ok) {
        const { donations } = await donationsResponse.json()
        setUserDonations(donations || [])
      } else {
        console.error('Failed to load donations')
        setUserDonations([])
      }

      // For now, programs are still mock data since we don't have a programs enrollment system
      const mockPrograms: UserProgram[] = []
      setUserPrograms(mockPrograms)
      
    } catch (error) {
      console.error('Error loading user data:', error)
      // Set empty arrays on error
      setUserOrders([])
      setUserDonations([])
      setUserPrograms([])
    } finally {
      console.log('User data loading completed')
      setLoading(false)
      setDataLoaded(true)
      loadingRef.current = false
    }
  }

  const handleProfileUpdate = async () => {
    try {
      if (!user?.email) {
        throw new Error('No user email available')
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          profileData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const result = await response.json()
      
      // Update local user data
      if (result.user) {
        // You might want to update the auth context here
        // Profile updated successfully
      }

      // Show success message using toast
      showToast('success', 'Profile updated successfully!')
      
      setEditProfile(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      showToast('error', `Error updating profile: ${errorMessage}`)
    }
  }

  // Donation handling functions
  const handleDonationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setDonationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDonationLoading(true)
    setDonationStatus('processing')
    setDonationError('')

    try {
      const amount = parseFloat(donationForm.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }

      // Generate unique reference
      const reference = `BOA_ME_DONATION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Create donation record with pending status
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donor_name: donationForm.isAnonymous ? 'Anonymous' : donationForm.donorName,
          donor_email: donationForm.donorEmail,
          amount: amount,
          message: donationForm.message,
          payment_reference: reference,
          payment_status: 'pending'
        })
      })

      if (!donationResponse.ok) {
        const errorData = await donationResponse.json()
        throw new Error(errorData.error || 'Failed to create donation')
      }

      // Get the created donation data
      const donationData = await donationResponse.json()

      // Initialize Paystack payment
      const paymentData = await initializePaystackPayment(
        amount,
        donationForm.donorEmail,
        reference,
        `${window.location.origin}/payment/callback`
      )

      if (paymentData.status && paymentData.data.authorization_url) {
        // Store donation details in localStorage for callback
        localStorage.setItem('donation_details', JSON.stringify({
          amount: amount,
          donorName: donationForm.isAnonymous ? 'Anonymous' : donationForm.donorName,
          donorEmail: donationForm.donorEmail,
          donorMessage: donationForm.message,
          reference,
          donationId: donationData.donation.id
        }))
        
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url
      } else {
        throw new Error(paymentData.message || 'Payment initialization failed')
      }
      
    } catch (error) {
      console.error('Donation error:', error)
      setDonationStatus('error')
      setDonationError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setDonationLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'processing':
      case 'enrolled':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.user_metadata?.name}!</h1>
                <p className="text-gray-600">Manage your account and track your activities</p>
              </div>
            </div>
            <button
              onClick={() => setEditProfile(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: TrendingUp },
                { id: 'orders', name: 'My Orders', icon: ShoppingCart },
                { id: 'donations', name: 'My Donations', icon: Heart },
                { id: 'donate', name: 'Donate', icon: Heart },
                { id: 'programs', name: 'My Programs', icon: Target },
                { id: 'profile', name: 'Profile', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Orders</p>
                      <p className="text-2xl font-bold">{userOrders.length}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-green-100" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Donations</p>
                      <p className="text-2xl font-bold">${userDonations.reduce((sum, d) => sum + d.amount, 0)}</p>
                    </div>
                    <Heart className="h-8 w-8 text-blue-100" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Active Programs</p>
                      <p className="text-2xl font-bold">{userPrograms.filter(p => p.status === 'enrolled').length}</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-100" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Completed</p>
                      <p className="text-2xl font-bold">{userPrograms.filter(p => p.status === 'completed').length}</p>
                    </div>
                    <Award className="h-8 w-8 text-orange-100" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {userOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.total}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Donations</h3>
                  <div className="space-y-3">
                    {userDonations.slice(0, 3).map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">${donation.amount}</p>
                          <p className="text-sm text-gray-600">{formatDate(donation.created_at)}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(donation.payment_status)}`}>
                          {donation.payment_status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${order.total}</p>
                        <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Donations</h2>
              <div className="space-y-4">
                {userDonations.map((donation) => (
                  <div key={donation.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">${donation.amount}</h3>
                        <p className="text-sm text-gray-600">{formatDate(donation.created_at)}</p>
                        {donation.message && (
                          <p className="text-sm text-gray-600 mt-1">"{donation.message}"</p>
                        )}
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(donation.payment_status)}`}>
                        {donation.payment_status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Transaction ID: {donation.id}</p>
                      <div className="flex space-x-3">
                        {donation.payment_status === 'success' && (
                          <button 
                            onClick={() => router.push(`/dashboard/user/receipt/${donation.id}`)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>View Receipt</span>
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Download Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Programs</h2>
              <div className="space-y-4">
                {userPrograms.map((program) => (
                  <div key={program.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{program.title}</h3>
                        <p className="text-sm text-gray-600">{program.category}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(program.start_date)} - {formatDate(program.end_date)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(program.status)}`}>
                        {program.status}
                      </span>
                    </div>
                    
                    {program.status === 'enrolled' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{program.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${program.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>View Program</span>
                      </button>
                      {program.status === 'completed' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span>Download Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donate Tab */}
          {activeTab === 'donate' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Heart className="h-16 w-16 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Make a Donation</h2>
                <p className="text-gray-600 text-lg">
                  Your contribution helps us empower more young people in Ghana
                </p>
              </div>



              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Donation Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Donation Details</h3>
                  
                  <form onSubmit={handleDonationSubmit} className="space-y-6">
                    {/* Donor Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Your Information</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="donorName"
                          value={donationForm.donorName}
                          onChange={handleDonationInputChange}
                          required
                          disabled={donationForm.isAnonymous}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="donorEmail"
                          value={donationForm.donorEmail}
                          onChange={handleDonationInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isAnonymous"
                          checked={donationForm.isAnonymous}
                          onChange={handleDonationInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Make this donation anonymous
                        </label>
                      </div>
                    </div>

                    {/* Donation Amount */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Donation Amount</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount (GHS) *
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={donationForm.amount}
                          onChange={handleDonationInputChange}
                          required
                          min="1"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter amount"
                        />
                      </div>

                      {/* Quick Amount Buttons */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quick Select
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[10, 25, 50, 100, 250, 500].map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => setDonationForm(prev => ({ ...prev, amount: amount.toString() }))}
                              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              ₵{amount}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={donationForm.message}
                        onChange={handleDonationInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Share why you're making this donation..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={donationLoading || donationStatus === 'processing'}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {donationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Donate Now
                        </>
                      )}
                    </button>
                  </form>

                  {/* Status Messages */}
                  {donationStatus === 'success' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800">Donation successful! Redirecting to receipt...</span>
                      </div>
                    </div>
                  )}

                  {donationStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-red-800">{donationError}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Information Panel */}
                <div className="space-y-6">
                  {/* Impact */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">₵25 provides school supplies for one student</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">₵50 funds a week of skills training</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">₵100 supports a month of mentorship</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">₵250 enables a complete leadership program</span>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Donation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-gray-700">SSL encrypted payment processing</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">Paystack secure payment gateway</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">PCI DSS compliant</span>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!editProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!editProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!editProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                    disabled={!editProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!editProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    disabled={!editProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Region</label>
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                    disabled={!editProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({...profileData, zipCode: e.target.value})}
                    disabled={!editProfile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              {editProfile && (
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditProfile(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
