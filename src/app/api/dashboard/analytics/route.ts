import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Fetch data from all tables
    const [
      usersResult,
      donationsResult,
      ordersResult,
      eventsResult,
      productsResult,
      blogPostsResult,
      contactsResult,
      newsletterResult,
      ticketPurchasesResult
    ] = await Promise.allSettled([
      supabaseAdmin.from('users').select('*'),
      supabaseAdmin.from('donations').select('*'),
      supabaseAdmin.from('orders').select('*'),
      supabaseAdmin.from('events').select('*'),
      supabaseAdmin.from('products').select('*'),
      supabaseAdmin.from('blog_posts').select('*'),
      supabaseAdmin.from('contacts').select('*'),
      supabaseAdmin.from('newsletter_subscriptions').select('*'),
      supabaseAdmin.from('ticket_purchases').select('*')
    ])

    // Extract data or handle errors
    const users = usersResult.status === 'fulfilled' ? usersResult.value.data || [] : []
    const donations = donationsResult.status === 'fulfilled' ? donationsResult.value.data || [] : []
    const orders = ordersResult.status === 'fulfilled' ? ordersResult.value.data || [] : []
    const events = eventsResult.status === 'fulfilled' ? eventsResult.value.data || [] : []
    const products = productsResult.status === 'fulfilled' ? productsResult.value.data || [] : []
    const blogPosts = blogPostsResult.status === 'fulfilled' ? blogPostsResult.value.data || [] : []
    const contacts = contactsResult.status === 'fulfilled' ? contactsResult.value.data || [] : []
    const newsletters = newsletterResult.status === 'fulfilled' ? newsletterResult.value.data || [] : []
    const tickets = ticketPurchasesResult.status === 'fulfilled' ? ticketPurchasesResult.value.data || [] : []

    // Calculate analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Total statistics
    const totalUsers = users.length
    const totalDonations = donations.length
    const totalOrders = orders.length
    const totalEvents = events.length
    const totalProducts = products.length
    const totalBlogPosts = blogPosts.length
    const totalContacts = contacts.length
    const totalNewsletterSubscriptions = newsletters.length

    // Revenue calculations
    const totalDonationAmount = donations
      .filter(d => d.payment_status === 'success')
      .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)

    const totalOrderAmount = orders
      .filter(o => o.payment_status === 'success')
      .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)

    const totalTicketAmount = tickets
      .filter(t => t.status === 'confirmed')
      .reduce((sum, t) => sum + (parseFloat(t.total_amount) || 0), 0)

    const totalRevenue = totalDonationAmount + totalOrderAmount + totalTicketAmount

    // Recent activity calculations (last 30 days)
    const recentDonations = donations.filter(d => 
      new Date(d.created_at) > thirtyDaysAgo
    ).length

    const recentOrders = orders.filter(o => 
      new Date(o.created_at) > thirtyDaysAgo
    ).length

    const recentUsers = users.filter(u => 
      new Date(u.created_at) > thirtyDaysAgo
    ).length

    // Active events (future or ongoing)
    const activeEvents = events.filter(e => 
      new Date(e.end_date) > now
    ).length

    // Growth calculations (compare last 7 days vs previous 7 days)
    const recentWeekUsers = users.filter(u => 
      new Date(u.created_at) > sevenDaysAgo
    ).length
    
    const previousWeekUsers = users.filter(u => {
      const created = new Date(u.created_at)
      return created <= sevenDaysAgo && created > new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
    }).length

    const growthRate = previousWeekUsers > 0 
      ? ((recentWeekUsers - previousWeekUsers) / previousWeekUsers * 100)
      : recentWeekUsers > 0 ? 100 : 0

    // Monthly data for charts (last 6 months)
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthDonations = donations
        .filter(d => {
          const created = new Date(d.created_at)
          return created >= monthStart && created <= monthEnd && d.payment_status === 'success'
        })
        .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)

      const monthOrders = orders
        .filter(o => {
          const created = new Date(o.created_at)
          return created >= monthStart && created <= monthEnd && o.payment_status === 'success'
        })
        .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)

      const monthTickets = tickets
        .filter(t => {
          const created = new Date(t.created_at)
          return created >= monthStart && created <= monthEnd && t.status === 'confirmed'
        })
        .reduce((sum, t) => sum + (parseFloat(t.total_amount) || 0), 0)

      const monthUsers = users.filter(u => {
        const created = new Date(u.created_at)
        return created >= monthStart && created <= monthEnd
      }).length

      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        donations: monthDonations,
        orders: monthOrders,
        tickets: monthTickets,
        total: monthDonations + monthOrders + monthTickets,
        users: monthUsers,
        newUsers: monthUsers,
        returningUsers: Math.floor(monthUsers * 0.3) // Estimate
      })
    }

    // Recent activity feed
    const recentActivity = []

    // Add recent donations
    const recentDonationsList = donations
      .filter(d => new Date(d.created_at) > sevenDaysAgo)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)
      .map(d => ({
        id: d.id,
        type: 'donation' as const,
        description: `New donation received`,
        amount: parseFloat(d.amount),
        user: d.donor_name,
        timestamp: getTimeAgo(d.created_at),
        status: d.payment_status === 'success' ? 'success' as const : 'pending' as const
      }))

    // Add recent orders
    const recentOrdersList = orders
      .filter(o => new Date(o.created_at) > sevenDaysAgo)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)
      .map(o => ({
        id: o.id,
        type: 'purchase' as const,
        description: `Shop order placed`,
        amount: parseFloat(o.total),
        user: o.customer_name,
        timestamp: getTimeAgo(o.created_at),
        status: o.payment_status === 'success' ? 'success' as const : 'pending' as const
      }))

    // Add recent ticket purchases
    const recentTicketsList = tickets
      .filter(t => new Date(t.created_at) > sevenDaysAgo)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)
      .map(t => ({
        id: t.id,
        type: 'registration' as const,
        description: `Event ticket purchased`,
        amount: parseFloat(t.total_amount),
        user: t.customer_name,
        timestamp: getTimeAgo(t.created_at),
        status: t.status === 'confirmed' ? 'success' as const : 'pending' as const
      }))

    recentActivity.push(...recentDonationsList, ...recentOrdersList, ...recentTicketsList)
    recentActivity.sort((a, b) => {
      // Sort by timestamp (most recent first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    // Category distribution for pie chart
    const categoryData = [
      { 
        name: 'Donations', 
        value: totalDonationAmount, 
        color: '#10B981',
        percentage: totalRevenue > 0 ? Math.round((totalDonationAmount / totalRevenue) * 100) : 0
      },
      { 
        name: 'Shop Orders', 
        value: totalOrderAmount, 
        color: '#3B82F6',
        percentage: totalRevenue > 0 ? Math.round((totalOrderAmount / totalRevenue) * 100) : 0
      },
      { 
        name: 'Event Tickets', 
        value: totalTicketAmount, 
        color: '#8B5CF6',
        percentage: totalRevenue > 0 ? Math.round((totalTicketAmount / totalRevenue) * 100) : 0
      }
    ].filter(item => item.value > 0)

    // Calculate satisfaction rate (based on successful transactions)
    const totalTransactions = donations.length + orders.length + tickets.length
    const successfulTransactions = donations.filter(d => d.payment_status === 'success').length +
                                 orders.filter(o => o.payment_status === 'success').length +
                                 tickets.filter(t => t.status === 'confirmed').length
    
    const satisfactionRate = totalTransactions > 0 
      ? Math.round((successfulTransactions / totalTransactions) * 100)
      : 0

    // Response data
    const analyticsData = {
      stats: {
        totalUsers,
        totalDonations: totalDonationAmount,
        totalRevenue,
        totalPrograms: totalBlogPosts, // Use blog posts as programs for now
        totalBlogPosts,
        totalShopItems: totalProducts,
        monthlyVisitors: recentUsers * 10, // Estimate
        conversionRate: totalTransactions > 0 ? Math.round((successfulTransactions / totalUsers) * 100) : 0,
        seoScore: 85, // Static for now
        pageLoadSpeed: 2.1, // Static for now
        totalEvents: activeEvents,
        activeProjects: Math.ceil(totalEvents * 0.7), // Estimate
        satisfactionRate,
        growthRate: Math.round(growthRate * 10) / 10
      },
      monthlyData: months,
      categoryData,
      recentActivity: recentActivity.slice(0, 5)
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    console.error('Dashboard analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    )
  }
}

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
  const now = new Date()
  const past = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
  return `${Math.floor(diffInMinutes / 1440)} days ago`
}