'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  ArrowDownRight,
  Settings,
  ExternalLink,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  Award,
  Clock,
  MapPin,
  Star,
  Zap,
  CheckCircle
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  AreaChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Pie
} from 'recharts'

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
  totalEvents: number
  activeProjects: number
  satisfactionRate: number
  growthRate: number
}

interface TrafficData {
  date: string
  visitors: number
  pageViews: number
  bounceRate: number
  newUsers: number
  returningUsers: number
}

interface RevenueData {
  month: string
  donations: number
  events: number
  shop: number
  total: number
}

interface CategoryData {
  name: string
  value: number
  color: string
  percentage: number
}

interface ProjectData {
  id: string
  name: string
  status: 'active' | 'completed' | 'planning'
  progress: number
  budget: number
  spent: number
  team: number
  deadline: string
  priority: 'high' | 'medium' | 'low'
}

interface ActivityData {
  id: string
  type: 'donation' | 'registration' | 'purchase' | 'event'
  description: string
  amount?: number
  user: string
  timestamp: string
  status: 'success' | 'pending' | 'failed'
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')
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
    pageLoadSpeed: 0,
    totalEvents: 0,
    activeProjects: 0,
    satisfactionRate: 0,
    growthRate: 0
  })

  // State for dynamic data from API
  const [trafficData, setTrafficData] = useState<TrafficData[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityData[]>([])

  // Static SEO data (keeping this for now as it's not in database)
  const [seoData] = useState<SEOData[]>([
    { metric: 'Page Speed', score: 85, status: 'good', change: 12 },
    { metric: 'Mobile Optimization', score: 92, status: 'good', change: 8 },
    { metric: 'SEO Score', score: 78, status: 'warning', change: -5 },
    { metric: 'Accessibility', score: 88, status: 'good', change: 15 },
    { metric: 'Best Practices', score: 95, status: 'good', change: 3 },
  ])

  // Project data (keeping static for now)
  const [projectData] = useState<ProjectData[]>([
    {
      id: '1',
      name: 'Youth Leadership Training',
      status: 'active',
      progress: 75,
      budget: 25000,
      spent: 18750,
      team: 8,
      deadline: '2024-12-15',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Community Health Program',
      status: 'active',
      progress: 45,
      budget: 15000,
      spent: 6750,
      team: 5,
      deadline: '2025-01-30',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Digital Skills Workshop',
      status: 'planning',
      progress: 20,
      budget: 8000,
      spent: 1600,
      team: 3,
      deadline: '2024-11-20',
      priority: 'high'
    },
    {
      id: '4',
      name: 'Environmental Awareness',
      status: 'completed',
      progress: 100,
      budget: 12000,
      spent: 11500,
      team: 6,
      deadline: '2024-09-30',
      priority: 'low'
    }
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
    
    // Set up auto-refresh every 5 minutes for real-time updates
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [user, router])

  const fetchDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setConnectionStatus('connecting')
      setHasError(false)
      
      // Fetch real data from API
      const response = await fetch('/api/dashboard/analytics', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Update state with real data
      setStats(data.stats)
      setTrafficData(data.monthlyData)
      setRevenueData(data.monthlyData)
      setCategoryData(data.categoryData)
      setRecentActivity(data.recentActivity)
      setLastUpdated(new Date())
      setConnectionStatus('connected')
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setHasError(true)
      setConnectionStatus('disconnected')
      
      // Fallback to mock data if API fails
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
        pageLoadSpeed: 2.3,
        totalEvents: 18,
        activeProjects: 8,
        satisfactionRate: 94.5,
        growthRate: 12.8
      }
      setStats(mockStats)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    fetchDashboardData(true)
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
      {/* Error Banner */}
      {hasError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExternalLink className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Connection Issue:</strong> Unable to fetch live data from the database. 
                Showing cached data. Click refresh to try again.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.user_metadata?.name || user?.email}! Here's what's happening with your organization.</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'disconnected' ? 'bg-red-500' :
              'bg-yellow-500'
            }`}></div>
            <span className={`text-xs font-medium ${
              connectionStatus === 'connected' ? 'text-green-600' :
              connectionStatus === 'disconnected' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {connectionStatus === 'connected' ? 'Live Data' :
               connectionStatus === 'disconnected' ? 'Using Cached Data' :
               'Connecting...'}
            </span>
          </div>
          
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Activity className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
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
      </div>



      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+{stats.growthRate}%</span>
            <span className="text-blue-600 ml-1">growth this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">₵{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+8.2%</span>
            <span className="text-green-600 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Active Events</p>
              <p className="text-3xl font-bold text-purple-900">{stats.totalEvents}</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calendar className="h-4 w-4 text-purple-600 mr-1" />
            <span className="text-purple-600 font-medium">{stats.activeProjects}</span>
            <span className="text-purple-600 ml-1">projects running</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Satisfaction Rate</p>
              <p className="text-3xl font-bold text-orange-900">{stats.satisfactionRate}%</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+2.1%</span>
            <span className="text-orange-600 ml-1">user satisfaction</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
              <p className="text-sm text-gray-600">Monthly revenue breakdown by source</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Donations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Shop</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="donations" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="events" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="shop" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Program Distribution</h3>
              <p className="text-sm text-gray-600">Resource allocation by category</p>
            </div>
            <PieChart className="h-6 w-6 text-gray-400" />
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#f9fafb', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }} 
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="w-40 space-y-3">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Analytics Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Website Analytics</h3>
              <p className="text-sm text-gray-600">Visitor engagement and traffic patterns</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">New Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Returning</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RechartsBarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="newUsers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returningUsers" fill="#10b981" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <p className="text-sm text-gray-600">Key performance indicators</p>
            </div>
            <Activity className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-3">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.seoScore / 100)}`}
                    className="text-green-500 transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-xl font-bold text-gray-900">{stats.seoScore}%</span>
              </div>
              <p className="text-sm font-medium text-gray-900">SEO Score</p>
              <p className="text-xs text-gray-500">Website optimization</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <p className="text-lg font-bold text-blue-900">{stats.pageLoadSpeed}s</p>
                <p className="text-xs text-blue-600">Load Speed</p>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <p className="text-lg font-bold text-purple-900">{stats.conversionRate}%</p>
                <p className="text-xs text-purple-600">Conversion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Management Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
              <p className="text-sm text-gray-600">Current project status and progress</p>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">{projectData.filter(p => p.status === 'active').length} Active</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Project</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Progress</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Budget</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Team</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Priority</th>
                </tr>
              </thead>
              <tbody>
                {projectData.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              project.progress >= 75 ? 'bg-green-500' :
                              project.progress >= 50 ? 'bg-blue-500' :
                              project.progress >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-xs font-medium text-gray-900">₵{project.spent.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">of ₵{project.budget.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-700">{project.team}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.priority === 'high' ? 'bg-red-100 text-red-800' :
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600">Latest system activities</p>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'donation' ? 'bg-green-100' :
                  activity.type === 'registration' ? 'bg-blue-100' :
                  activity.type === 'purchase' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {activity.type === 'donation' && <Heart className="h-4 w-4 text-green-600" />}
                  {activity.type === 'registration' && <Users className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'purchase' && <ShoppingCart className="h-4 w-4 text-purple-600" />}
                  {activity.type === 'event' && <Calendar className="h-4 w-4 text-orange-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'success' ? 'bg-green-100 text-green-800' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.status === 'success' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                      {activity.status === 'pending' && <Clock className="h-3 w-3 inline mr-1" />}
                      {activity.status === 'failed' && <ExternalLink className="h-3 w-3 inline mr-1" />}
                      {activity.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                    {activity.amount && (
                      <p className="text-xs font-medium text-gray-700">₵{activity.amount}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href="/dashboard/activity" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View all activity
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Administrative Tools */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Administrative Tools</h3>
            <p className="text-sm text-gray-600">Quick access to key management features</p>
          </div>
          <Settings className="h-6 w-6 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Users Management */}
          <Link 
            href="/dashboard/users"
            className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
              User Management
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Manage user accounts, roles, and permissions
            </p>
            <div className="mt-3 flex items-center text-xs text-blue-600">
              <span>Manage Users</span>
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </div>
          </Link>

          {/* Analytics */}
          <Link 
            href="/dashboard/analytics"
            className="group p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
              Advanced Analytics
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Detailed reports and data insights
            </p>
            <div className="mt-3 flex items-center text-xs text-purple-600">
              <span>View Analytics</span>
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </div>
          </Link>

          {/* Donations Management */}
          <Link 
            href="/dashboard/donations"
            className="group p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Heart className="h-5 w-5 text-orange-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
              Donations
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Track and manage donations and donors
            </p>
            <div className="mt-3 flex items-center text-xs text-orange-600">
              <span>Manage Donations</span>
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </div>
          </Link>

          {/* Programs Management */}
          <Link 
            href="/dashboard/programs"
            className="group p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                <Target className="h-5 w-5 text-teal-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
              Programs
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Manage youth empowerment programs
            </p>
            <div className="mt-3 flex items-center text-xs text-teal-600">
              <span>Manage Programs</span>
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </div>
          </Link>

          {/* Settings */}
          <Link 
            href="/dashboard/settings"
            className="group p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
              Settings
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Configure system and user preferences
            </p>
            <div className="mt-3 flex items-center text-xs text-gray-600">
              <span>Open Settings</span>
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}