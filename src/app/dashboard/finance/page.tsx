'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

export default function FinancePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {
    const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      router.push('/dashboard/user')
      return
    }

    fetchFinanceStats()
  }, [user, router])

  const fetchFinanceStats = async () => {
    try {
      // Fetch donations and orders data
      const [donationsRes, ordersRes] = await Promise.all([
        fetch('/api/donations'),
        fetch('/api/orders')
      ])

      const donationsData = await donationsRes.json()
      const ordersData = await ordersRes.json()

      const donations = donationsData.donations || []
      const orders = ordersData.orders || []

      const totalDonations = donations.reduce((sum: number, d: any) => sum + d.amount, 0)
      const totalOrders = orders.reduce((sum: number, o: any) => sum + o.total, 0)
      const totalRevenue = totalDonations + totalOrders

      setStats({
        totalDonations,
        totalOrders,
        totalRevenue,
        monthlyGrowth: 12.5 // Mock data
      })
    } catch (error) {
      console.error('Error fetching finance stats:', error)
    } finally {
      setLoading(false)
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
          <p className="text-gray-500 text-lg">Loading finance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Overview</h1>
          <p className="text-gray-600">Monitor financial performance and revenue</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₵{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Donations</p>
              <p className="text-2xl font-bold text-gray-900">₵{stats.totalDonations.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shop Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₵{stats.totalOrders.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart will be implemented here</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">Donation</p>
                <p className="text-sm text-gray-500">From John Doe</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+₵100.00</p>
                <p className="text-sm text-gray-500">Today</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">Shop Order</p>
                <p className="text-sm text-gray-500">T-shirt purchase</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+₵25.00</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">This Month</h4>
            <p className="text-2xl font-bold text-gray-900">₵{(stats.totalRevenue * 0.3).toFixed(2)}</p>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +15% from last month
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">This Quarter</h4>
            <p className="text-2xl font-bold text-gray-900">₵{(stats.totalRevenue * 0.8).toFixed(2)}</p>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8% from last quarter
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">This Year</h4>
            <p className="text-2xl font-bold text-gray-900">₵{stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +25% from last year
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

