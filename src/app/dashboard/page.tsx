'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  TrendingUp, 
  Eye, 
  ShoppingCart, 
  Heart, 
  DollarSign, 
  FileText,
  Target,
  BarChart3,
  Activity,
  Globe,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalDonations: number
  totalRevenue: number
  totalPrograms: number
  totalBlogPosts: number
  totalShopItems: number
  monthlyVisitors: number
  conversionRate: number
  seoScore: number
  pageLoadSpeed: number
}

interface TrafficData {
  date: string
  visitors: number
  pageViews: number
  bounceRate: number
}

interface SEOData {
  metric: string
  score: number
  status: 'good' | 'warning' | 'poor'
  change: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDonations: 0,
    totalRevenue: 0,
    totalPrograms: 0,
    totalBlogPosts: 0,
    totalShopItems: 0,
    monthlyVisitors: 0,
    conversionRate: 0,
    seoScore: 0,
    pageLoadSpeed: 0
  })

  const [trafficData] = useState<TrafficData[]>([
    { date: 'Jan', visitors: 1200, pageViews: 3400, bounceRate: 45 },
    { date: 'Feb', visitors: 1400, pageViews: 3800, bounceRate: 42 },
    { date: 'Mar', visitors: 1600, pageViews: 4200, bounceRate: 40 },
    { date: 'Apr', visitors: 1800, pageViews: 4600, bounceRate: 38 },
    { date: 'May', visitors: 2000, pageViews: 5000, bounceRate: 35 },
    { date: 'Jun', visitors: 2200, pageViews: 5400, bounceRate: 32 },
    { date: 'Jul', visitors: 2400, pageViews: 5800, bounceRate: 30 },
  ])

  const [seoData] = useState<SEOData[]>([
    { metric: 'Page Speed', score: 85, status: 'good', change: 12 },
    { metric: 'Mobile Optimization', score: 92, status: 'good', change: 8 },
    { metric: 'SEO Score', score: 78, status: 'warning', change: -5 },
    { metric: 'Accessibility', score: 88, status: 'good', change: 15 },
    { metric: 'Best Practices', score: 95, status: 'good', change: 3 },
  ])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Redirect regular users to user dashboard
    if (user.user_metadata?.role !== 'admin') {
      router.push('/dashboard/user')
      return
    }

    fetchDashboardData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        totalDonations: 89,
        totalRevenue: 15420,
        totalPrograms: 12,
        totalBlogPosts: 23,
        totalShopItems: 45,
        monthlyVisitors: 15420,
        conversionRate: 3.2,
        seoScore: 78,
        pageLoadSpeed: 2.3
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBgColor = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good': return 'bg-green-100'
      case 'warning': return 'bg-yellow-100'
      case 'poor': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening with your organization.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₵{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+8.2%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyVisitors.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+15.3%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+2.1%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Website Traffic</h3>
            <p className="text-sm text-gray-600">Monthly visitor trends and engagement</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Visitors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Page Views</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {trafficData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '200px' }}>
                <div 
                  className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(data.visitors / 2400) * 100}%` }}
                ></div>
                <div 
                  className="absolute bottom-0 w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                  style={{ height: `${(data.pageViews / 5800) * 100}%` }}
                ></div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-900">{data.date}</p>
                <p className="text-xs text-gray-500">{data.visitors.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SEO Performance</h3>
              <p className="text-sm text-gray-600">Website optimization metrics</p>
            </div>
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {seoData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusBgColor(item.status)}`}>
                    <BarChart3 className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.metric}</p>
                    <p className="text-xs text-gray-500">Score: {item.score}/100</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.change > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Content Overview</h3>
              <p className="text-sm text-gray-600">Your organization's content metrics</p>
            </div>
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Programs</p>
                  <p className="text-xs text-gray-600">Youth empowerment initiatives</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.totalPrograms}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Blog Posts</p>
                  <p className="text-xs text-gray-600">Published articles</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.totalBlogPosts}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Shop Items</p>
                  <p className="text-xs text-gray-600">Available products</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600">{stats.totalShopItems}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Donations</p>
                  <p className="text-xs text-gray-600">Received contributions</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-600">{stats.totalDonations}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            <p className="text-sm text-gray-600">Website performance and user experience</p>
          </div>
          <Activity className="h-6 w-6 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - stats.seoScore / 100)}`}
                  className="text-green-500"
                />
              </svg>
              <span className="absolute text-lg font-bold text-gray-900">{stats.seoScore}%</span>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900">SEO Score</p>
            <p className="text-xs text-gray-500">Website optimization</p>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - (100 - stats.pageLoadSpeed * 20) / 100)}`}
                  className="text-blue-500"
                />
              </svg>
              <span className="absolute text-lg font-bold text-gray-900">{stats.pageLoadSpeed}s</span>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900">Load Speed</p>
            <p className="text-xs text-gray-500">Page loading time</p>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - stats.conversionRate / 10)}`}
                  className="text-purple-500"
                />
              </svg>
              <span className="absolute text-lg font-bold text-gray-900">{stats.conversionRate}%</span>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900">Conversion Rate</p>
            <p className="text-xs text-gray-500">Visitor to donor ratio</p>
          </div>
        </div>
      </div>
    </div>
  )
}