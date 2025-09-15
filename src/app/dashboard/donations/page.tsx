'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Heart, Search, Eye, Download, RefreshCw } from 'lucide-react'

interface Donation {
  id: string
  donor_name: string
  donor_email: string
  amount: number
  payment_status: string
  payment_reference: string
  created_at: string
}

export default function DonationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [verifyingPayments, setVerifyingPayments] = useState<Set<string>>(new Set())

  useEffect(() => {
    const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      router.push('/dashboard/user')
      return
    }

    fetchDonations()
  }, [user, router])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      
      // Fetch real donations from database
      const response = await fetch('/api/donations')
      
      if (response.ok) {
        const data = await response.json()
        setDonations(data.donations || [])
        console.log('Fetched donations from database:', data.donations)
      } else {
        console.error('Failed to fetch donations from database')
        
        // Fallback to mock data for development
        const mockDonations = [
          {
            id: "4563634e-9b39-4778-9d50-467e948e3241",
            donor_name: "Anonymous",
            donor_email: "kusi@exam.com",
            amount: 100,
            payment_reference: "BOA_ME_DONATION_1755783743734_2hzj5dny5",
            payment_status: "pending",
            created_at: "2025-08-21T13:42:25.389951+00:00"
          },
          {
            id: "3723477e-7d03-4051-9f62-dd2fb6ce669b",
            donor_name: "Test Auth",
            donor_email: "test@auth.com",
            amount: 15,
            payment_reference: "AUTH_TEST_001",
            payment_status: "pending",
            created_at: "2025-08-21T12:36:19.838413+00:00"
          },
          {
            id: "5ad5c825-52e6-4451-8df9-1da14a7fc6ba",
            donor_name: "John Doe",
            donor_email: "john@example.com",
            amount: 50,
            payment_reference: "ADMIN_TEST_001",
            payment_status: "pending",
            created_at: "2025-08-21T12:29:01.341252+00:00"
          }
        ]
        
        setDonations(mockDonations)
        console.log('Using mock donations data')
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
      setDonations([])
    } finally {
      setLoading(false)
    }
  }

  const filteredDonations = donations.filter(donation =>
    donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.donor_email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalAmount = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0)

  const verifyPayment = async (reference: string) => {
    setVerifyingPayments(prev => new Set(prev).add(reference))
    
    try {
      const response = await fetch('/api/donations/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference })
      })

             if (response.ok) {
         const result = await response.json()
         console.log('Payment verification result:', result)
         
         // Update the donation status in the local state
         setDonations(prev => prev.map(donation => 
           donation.payment_reference === reference 
             ? { ...donation, payment_status: result.payment_status }
             : donation
         ))
         
         // Show success message
         alert(`Payment status updated to: ${result.payment_status}`)
       } else {
        const error = await response.json()
        alert(`Verification failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      alert('Failed to verify payment. Please try again.')
    } finally {
      setVerifyingPayments(prev => {
        const newSet = new Set(prev)
        newSet.delete(reference)
        return newSet
      })
    }
  }

  const userRole = user?.user_metadata?.role || 'user'
  if (userRole !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading donations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations Management</h1>
          <p className="text-gray-600">View and manage all donations</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={async () => {
              const pendingDonations = donations.filter(d => d.payment_status === 'pending')
              if (pendingDonations.length === 0) {
                alert('No pending donations to verify')
                return
              }
              
              if (confirm(`Verify ${pendingDonations.length} pending payments?`)) {
                for (const donation of pendingDonations) {
                  await verifyPayment(donation.payment_reference)
                }
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verify All Pending
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{filteredDonations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₵{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredDonations.filter(d => d.payment_status === 'success').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search donations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Donations Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading donations...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{donation.donor_name}</div>
                      <div className="text-sm text-gray-500">{donation.donor_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₵{donation.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      donation.payment_status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : donation.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {donation.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      {donation.payment_status === 'pending' && (
                        <button 
                          onClick={() => verifyPayment(donation.payment_reference)}
                          disabled={verifyingPayments.has(donation.payment_reference)}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Verify Payment"
                        >
                          {verifyingPayments.has(donation.payment_reference) ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredDonations.length === 0 && (
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-2 text-gray-600">No donations found</p>
        </div>
      )}
    </div>
  )
}
