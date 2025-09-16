'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

interface Donation {
  id: string
  donor_name: string
  donor_email: string
  amount: number
  created_at: string
  payment_status: string
}

interface Order {
  id: string
  customer_name: string
  total: number
  created_at: string
  payment_status: string
}

export default function FinancePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    thisMonthRevenue: 0,
    thisQuarterRevenue: 0,
    thisYearRevenue: 0
  })
  const [recentTransactions, setRecentTransactions] = useState<(Donation | Order)[]>([])
  const [error, setError] = useState<string | null>(null)

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
      setLoading(true)
      setError(null)
      
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error('Database not configured. Please check your environment variables.')
      }
      
      // Fetch donations data
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })

      if (donationsError) {
        console.error('Error fetching donations:', donationsError)
        throw new Error(`Failed to fetch donations: ${donationsError.message}`)
      }

      // Fetch orders data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error fetching orders:', ordersError)
        throw new Error(`Failed to fetch orders: ${ordersError.message}`)
      }

      // Calculate totals
      const totalDonations = donationsData.reduce((sum: number, d: Donation) => sum + d.amount, 0)
      const totalOrders = ordersData.reduce((sum: number, o: Order) => sum + o.total, 0)
      const totalRevenue = totalDonations + totalOrders

      // Calculate this month's revenue
      const now = new Date()
      const thisMonth = now.getMonth()
      const thisYear = now.getFullYear()
      
      const thisMonthDonations = donationsData.filter(d => {
        const date = new Date(d.created_at)
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear
      }).reduce((sum, d) => sum + d.amount, 0)
      
      const thisMonthOrders = ordersData.filter(o => {
        const date = new Date(o.created_at)
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear
      }).reduce((sum, o) => sum + o.total, 0)
      
      const thisMonthRevenue = thisMonthDonations + thisMonthOrders

      // Calculate this quarter's revenue
      const quarterStartMonth = Math.floor(thisMonth / 3) * 3
      const thisQuarterDonations = donationsData.filter(d => {
        const date = new Date(d.created_at)
        return date.getMonth() >= quarterStartMonth && 
               date.getMonth() < quarterStartMonth + 3 && 
               date.getFullYear() === thisYear
      }).reduce((sum, d) => sum + d.amount, 0)
      
      const thisQuarterOrders = ordersData.filter(o => {
        const date = new Date(o.created_at)
        return date.getMonth() >= quarterStartMonth && 
               date.getMonth() < quarterStartMonth + 3 && 
               date.getFullYear() === thisYear
      }).reduce((sum, o) => sum + o.total, 0)
      
      const thisQuarterRevenue = thisQuarterDonations + thisQuarterOrders

      // Calculate this year's revenue
      const thisYearDonations = donationsData.filter(d => {
        const date = new Date(d.created_at)
        return date.getFullYear() === thisYear
      }).reduce((sum, d) => sum + d.amount, 0)
      
      const thisYearOrders = ordersData.filter(o => {
        const date = new Date(o.created_at)
        return date.getFullYear() === thisYear
      }).reduce((sum, o) => sum + o.total, 0)
      
      const thisYearRevenue = thisYearDonations + thisYearOrders

      // Calculate monthly growth (comparing this month to last month)
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear
      
      const lastMonthDonations = donationsData.filter(d => {
        const date = new Date(d.created_at)
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      }).reduce((sum, d) => sum + d.amount, 0)
      
      const lastMonthOrders = ordersData.filter(o => {
        const date = new Date(o.created_at)
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      }).reduce((sum, o) => sum + o.total, 0)
      
      const lastMonthRevenue = lastMonthDonations + lastMonthOrders
      
      const monthlyGrowth = lastMonthRevenue > 0 
        ? parseFloat(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1))
        : 0

      // Get recent transactions (combine and sort by date)
      const allTransactions = [
        ...donationsData.map((d: Donation) => ({ ...d, type: 'donation' })),
        ...ordersData.map((o: Order) => ({ ...o, type: 'order' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10) // Get top 10 most recent

      setStats({
        totalDonations,
        totalOrders,
        totalRevenue,
        monthlyGrowth,
        thisMonthRevenue,
        thisQuarterRevenue,
        thisYearRevenue
      })

      setRecentTransactions(allTransactions)
    } catch (error: any) {
      console.error('Error fetching finance stats:', error)
      setError(error.message || 'Failed to fetch finance data. Please try again later.')
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">Error: {error}</div>
          <button 
            onClick={fetchFinanceStats}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Retry
          </button>
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
              <p className={`text-2xl font-bold ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth}%
              </p>
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
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 5).map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type === 'donation' ? 'Donation' : 'Shop Order'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.type === 'donation' 
                        ? `From ${transaction.donor_name}` 
                        : `By ${transaction.customer_name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount || transaction.total > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      {transaction.amount || transaction.total > 0 
                        ? `+₵${(transaction.amount || transaction.total).toFixed(2)}` 
                        : '₵0.00'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">This Month</h4>
            <p className="text-2xl font-bold text-gray-900">₵{stats.thisMonthRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">₵0.00 from last month</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">This Quarter</h4>
            <p className="text-2xl font-bold text-gray-900">₵{stats.thisQuarterRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">₵0.00 from last quarter</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">This Year</h4>
            <p className="text-2xl font-bold text-gray-900">₵{stats.thisYearRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">₵0.00 from last year</p>
          </div>
        </div>
      </div>
    </div>
  )
}