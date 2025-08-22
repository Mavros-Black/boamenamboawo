'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, Users, Eye, Download } from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalOrders: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      router.push('/dashboard/user')
      return
    }

    fetchAnalytics()
  }, [user, router])

  const fetchAnalytics = async () => {
    try {
      const [usersRes, donationsRes, ordersRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/donations'),
        fetch('/api/orders')
      ])

      const usersData = await usersRes.json()
      const donationsData = await donationsRes.json()
      const ordersData = await ordersRes.json()

      const users = usersData.users || []
      const donations = donationsData.donations || []
      const orders = ordersData.orders || []

      const totalDonations = donations.reduce((sum: number, d: any) => sum + d.amount, 0)
      const totalOrders = orders.reduce((sum: number, o: any) => sum + o.total, 0)

      setStats({
        totalUsers: users.length,
        totalDonations: donations.length,
        totalOrders: orders.length,
        totalRevenue: totalDonations + totalOrders
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
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
          <p className="text-gray-500 text-lg">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights and metrics</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₵{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">User growth chart will be implemented here</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Revenue trends chart will be implemented here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Conversion Rate</h4>
            <p className="text-2xl font-bold text-gray-900">3.2%</p>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +0.5% from last month
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Average Order Value</h4>
            <p className="text-2xl font-bold text-gray-900">₵45.50</p>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +₵2.30 from last month
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Customer Retention</h4>
            <p className="text-2xl font-bold text-gray-900">78%</p>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

