'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Calendar, 
  Plus, 
  Edit3, 
  BarChart3, 
  Ticket, 
  Users, 
  Search,
  Filter,
  Download,
  Eye,
  Settings,
  Trash2,
  ChevronRight,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  ImageIcon,
  Upload,
  X,
  Check as CheckIcon,
  Mail
} from 'lucide-react'

type Tab = 'overview' | 'create' | 'view' | 'analytics' | 'tickets' | 'attendees'

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  venue: string
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  ticket_sales?: number
  total_tickets?: number
  max_tickets?: number
  available_tickets?: number
  revenue?: number
  created_at: string
  image_url?: string
  ticket_price?: number
}

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Workshop',
    startDate: '',
    endDate: '',
    location: '',
    venue: '',
    ticketPrice: '',
    maxTickets: '',
    status: 'draft'
  })
  
  // Enhanced form state for multiple ticket types
  const [ticketTypes, setTicketTypes] = useState<{
    id: string
    name: string
    description: string
    price: string
    originalPrice: string
    maxQuantity: string
    benefits: string[]
    badge: string
  }[]>([{
    id: 'regular',
    name: 'Regular',
    description: 'Standard admission',
    price: '',
    originalPrice: '',
    maxQuantity: '',
    benefits: ['Event materials', 'Certificate of attendance'],
    badge: ''
  }])
  
  const [featuredBenefits, setFeaturedBenefits] = useState<string[]>(['Learn from industry experts', 'Network with professionals'])
  
  const [speakers, setSpeakers] = useState<{
    id: string
    name: string
    title: string
    bio: string
    expertiseAreas: string[]
  }[]>([{
    id: 'speaker1',
    name: '',
    title: '',
    bio: '',
    expertiseAreas: []
  }])
  
  const [agendaItems, setAgendaItems] = useState<{
    id: string
    title: string
    description: string
    startTime: string
    endTime: string
    sessionType: string
  }[]>([{
    id: 'item1',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    sessionType: 'session'
  }])

  const tabs = [
    { id: 'overview', label: 'Events Overview', icon: Calendar },
    { id: 'create', label: 'Create Event', icon: Plus },
    { id: 'view', label: 'View Event', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tickets', label: 'Ticket Management', icon: Ticket },
    { id: 'attendees', label: 'Attendee Management', icon: Users },
  ]

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      // Fetch all events for admin dashboard (not just published ones)
      const response = await fetch('/api/events?status=all')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        console.error('Failed to fetch events')
        // Fallback to mock data if API fails
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Youth Leadership Summit 2024',
            description: 'Annual summit bringing together young leaders from across Ghana',
            start_date: '2024-03-15T09:00:00Z',
            end_date: '2024-03-15T17:00:00Z',
            location: 'Accra',
            venue: 'Ghana International Conference Centre',
            status: 'published',
            ticket_sales: 245,
            total_tickets: 300,
            max_tickets: 300,
            available_tickets: 55,
            revenue: 12250,
            ticket_price: 50,
            created_at: '2024-02-01T10:00:00Z'
          }
        ]
        setEvents(mockEvents)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Image upload handlers
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB')
      return
    }

    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)  // Changed from 'image' to 'file'
      formData.append('folder', 'events')
      formData.append('bucket', 'images')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setImagePreview(data.url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'Workshop',
      startDate: '',
      endDate: '',
      location: '',
      venue: '',
      ticketPrice: '',
      maxTickets: '',
      status: 'draft'
    })
    // Reset enhanced fields
    setTicketTypes([{
      id: 'regular',
      name: 'Regular',
      description: 'Standard admission',
      price: '',
      originalPrice: '',
      maxQuantity: '',
      benefits: ['Event materials', 'Certificate of attendance'],
      badge: ''
    }])
    setFeaturedBenefits(['Learn from industry experts', 'Network with professionals'])
    setSpeakers([{
      id: 'speaker1',
      name: '',
      title: '',
      bio: '',
      expertiseAreas: []
    }])
    setAgendaItems([{
      id: 'item1',
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      sessionType: 'session'
    }])
    setImagePreview(null)
    setEditingEvent(null)
    setViewingEvent(null)
  }

  // Event management handlers
  const handleViewEvent = (event: Event) => {
    setViewingEvent(event)
    setActiveTab('view')
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      eventType: 'Workshop', // Default since not stored in DB
      startDate: event.start_date.slice(0, 16), // Format for datetime-local input
      endDate: event.end_date.slice(0, 16),
      location: event.location,
      venue: event.venue || '',
      ticketPrice: event.ticket_price?.toString() || '0',
      maxTickets: event.max_tickets?.toString() || '100',
      status: event.status
    })
    setImagePreview(event.image_url || null)
    setActiveTab('create') // Switch to create/edit tab
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete event')
        }

        // Remove event from local state
        setEvents(prev => prev.filter(event => event.id !== eventId))
        alert('Event deleted successfully!')
      } catch (error) {
        console.error('Error deleting event:', error)
        alert(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    
    if (!formData.title || !formData.startDate || !formData.endDate || !formData.location) {
      alert('Please fill in all required fields (Title, Start Date, End Date, Location)')
      return
    }

    setIsSubmitting(true)

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        location: formData.location,
        venue: formData.venue,
        ticket_price: formData.ticketPrice,
        max_tickets: formData.maxTickets,
        status: isDraft ? 'draft' : formData.status,
        image_url: imagePreview
      }

      const isEditing = !!editingEvent
      const url = isEditing ? `/api/events/${editingEvent.id}` : '/api/events'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} event`)
      }

      const result = await response.json()
      alert(`Event ${isEditing ? 'updated' : (isDraft ? 'saved as draft' : 'created')} successfully!`)
      
      // Reset form and switch to overview tab
      resetForm()
      setActiveTab('overview')
      
      // Refresh events list
      await fetchEvents()
      
    } catch (error) {
      console.error(`Error ${editingEvent ? 'updating' : 'creating'} event:`, error)
      alert(`Failed to ${editingEvent ? 'update' : 'create'} event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🎆 Events Dashboard Overview</h2>
            <p className="text-green-100">Welcome back! Here's what's happening with your events</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-100">Today</p>
            <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              <p className="text-xs text-green-500 mt-1">
                {events.filter(e => e.status === 'published').length} published
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tickets Sold</p>
              <p className="text-3xl font-bold text-purple-600">
                {events.reduce((sum, event) => sum + (event.ticket_sales || 0), 0)}
              </p>
              <p className="text-xs text-purple-500 mt-1">
                {events.reduce((sum, event) => sum + ((event.max_tickets || 0) - (event.ticket_sales || 0)), 0)} remaining
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Ticket className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">
                GH₵{events.reduce((sum, event) => sum + (event.revenue ?? 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-green-500 mt-1">
                +12% from last month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-3xl font-bold text-orange-600">
                {events.filter(e => e.status === 'published' || e.status === 'ongoing').length}
              </p>
              <p className="text-xs text-orange-500 mt-1">
                85% attendance rate
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📅 Recent Events</h3>
            <button 
              onClick={() => setActiveTab('create')}
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              + New Event
            </button>
          </div>
          <div className="space-y-3">
            {events.slice(0, 4).map((event) => {
              const statusColor = {
                'published': 'bg-green-100 text-green-800',
                'draft': 'bg-yellow-100 text-yellow-800',
                'ongoing': 'bg-blue-100 text-blue-800',
                'completed': 'bg-gray-100 text-gray-800',
                'cancelled': 'bg-red-100 text-red-800'
              }[event.status] || 'bg-gray-100 text-gray-800'
              
              return (
                <div key={event.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{event.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.ticket_sales || 0} sold</p>
                    <p className="text-xs text-gray-500">GH₵{(event.revenue || 0).toLocaleString()}</p>
                  </div>
                </div>
              )
            })}
          </div>
          
          {events.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No events yet</p>
              <button 
                onClick={() => setActiveTab('create')}
                className="mt-2 text-green-600 hover:text-green-800 font-medium"
              >
                Create your first event
              </button>
            </div>
          )}
        </div>

        {/* Event Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Event Performance</h3>
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => {
              const soldPercentage = event.max_tickets ? ((event.ticket_sales || 0) / event.max_tickets * 100) : 0
              const barColor = soldPercentage > 80 ? 'bg-green-500' : soldPercentage > 50 ? 'bg-yellow-500' : 'bg-red-500'
              
              return (
                <div key={event.id} className="">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate">{event.title}</span>
                    <span className="text-sm text-gray-500">{soldPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${Math.min(100, soldPercentage)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{event.ticket_sales || 0} sold</span>
                    <span>{event.max_tickets || 0} total</span>
                  </div>
                </div>
              )
            })}
          </div>
          
          {events.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No performance data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Status Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Event Status</h3>
          <div className="space-y-3">
            {[
              { status: 'published', label: 'Published', count: events.filter(e => e.status === 'published').length, color: 'text-green-600' },
              { status: 'draft', label: 'Draft', count: events.filter(e => e.status === 'draft').length, color: 'text-yellow-600' },
              { status: 'ongoing', label: 'Ongoing', count: events.filter(e => e.status === 'ongoing').length, color: 'text-blue-600' },
              { status: 'completed', label: 'Completed', count: events.filter(e => e.status === 'completed').length, color: 'text-gray-600' }
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    item.status === 'published' ? 'bg-green-500' :
                    item.status === 'draft' ? 'bg-yellow-500' :
                    item.status === 'ongoing' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <span className={`text-sm font-semibold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('create')}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </button>
            <button 
              onClick={() => setActiveTab('tickets')}
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Ticket className="h-4 w-4 mr-2" />
              Manage Tickets
            </button>
            <button 
              onClick={() => setActiveTab('attendees')}
              className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              <Users className="h-4 w-4 mr-2" />
              View Attendees
            </button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New ticket purchase', event: 'Youth Leadership Summit', time: '2 mins ago', type: 'purchase' },
              { action: 'Event published', event: 'Digital Skills Workshop', time: '1 hour ago', type: 'publish' },
              { action: 'Attendee checked in', event: 'Entrepreneurship Bootcamp', time: '3 hours ago', type: 'checkin' },
              { action: 'New event created', event: 'Community Impact Awards', time: '1 day ago', type: 'create' },
              { action: 'Report generated', event: 'Monthly Analytics', time: '2 days ago', type: 'report' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'purchase' ? 'bg-green-500' :
                  activity.type === 'publish' ? 'bg-blue-500' :
                  activity.type === 'checkin' ? 'bg-purple-500' :
                  activity.type === 'create' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.event}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 All Events</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Ticket className="h-4 w-4" />
                      {event.ticket_sales || 0}/{event.total_tickets || event.max_tickets || 0} sold
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      GH₵{((event.revenue ?? 0)).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewEvent(event)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="View Event"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditEvent(event)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit Event"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCreateEvent = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {editingEvent ? 'Edit Event' : 'Create New Event'}
      </h2>
      <form className="space-y-6" onSubmit={(e) => handleSubmit(e, false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter event title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <select 
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Workshop">Workshop</option>
              <option value="Conference">Conference</option>
              <option value="Seminar">Seminar</option>
              <option value="Training">Training</option>
              <option value="Social Event">Social Event</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe your event..."
          />
        </div>

        {/* Event Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Image
          </label>
          
          {/* Image Upload Area */}
          <div className="mt-2">
            {!imagePreview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-green-600 hover:text-green-500">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadingImage && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Uploading image...</span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time *</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time *</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location/City *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Accra, Kumasi"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Specific venue name"
            />
          </div>
        </div>

        {/* Enhanced Ticket Types Management */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">🎟️ Ticket Types & Pricing</h3>
          <div className="space-y-4 mb-6">
            {ticketTypes.map((ticket, index) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
                    <select
                      value={ticket.name}
                      onChange={(e) => {
                        const newTypes = [...ticketTypes]
                        newTypes[index].name = e.target.value
                        // Auto-populate some default values based on ticket type
                        if (e.target.value === 'Early Bird') {
                          newTypes[index].description = 'Limited time special pricing - Save money!'
                          newTypes[index].badge = 'Best Value'
                        } else if (e.target.value === 'Student') {
                          newTypes[index].description = 'Special discounted rate for students (ID required)'
                          newTypes[index].badge = 'Student Price'
                        } else if (e.target.value === 'VIP') {
                          newTypes[index].description = 'Premium access with exclusive benefits'
                          newTypes[index].badge = 'Most Popular'
                        } else if (e.target.value === 'Regular') {
                          newTypes[index].description = 'Standard admission with full access'
                          newTypes[index].badge = ''
                        } else if (e.target.value === 'Group') {
                          newTypes[index].description = 'Special pricing for group bookings (5+ people)'
                          newTypes[index].badge = 'Group Discount'
                        } else if (e.target.value === 'Senior') {
                          newTypes[index].description = 'Discounted rate for senior citizens'
                          newTypes[index].badge = 'Senior Discount'
                        } else {
                          newTypes[index].description = ''
                          newTypes[index].badge = ''
                        }
                        setTicketTypes(newTypes)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Ticket Type</option>
                      <option value="Early Bird">🐦 Early Bird</option>
                      <option value="Regular">🎫 Regular</option>
                      <option value="Student">🎓 Student</option>
                      <option value="VIP">⭐ VIP</option>
                      <option value="Group">👥 Group</option>
                      <option value="Senior">👴 Senior</option>
                      <option value="Corporate">🏢 Corporate</option>
                      <option value="Premium">💎 Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (GH₵)</label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => {
                        const newTypes = [...ticketTypes]
                        newTypes[index].price = e.target.value
                        setTicketTypes(newTypes)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (optional)</label>
                    <input
                      type="number"
                      value={ticket.originalPrice}
                      onChange={(e) => {
                        const newTypes = [...ticketTypes]
                        newTypes[index].originalPrice = e.target.value
                        setTicketTypes(newTypes)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={ticket.description}
                      onChange={(e) => {
                        const newTypes = [...ticketTypes]
                        newTypes[index].description = e.target.value
                        setTicketTypes(newTypes)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="Brief description of this ticket type"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Quantity</label>
                    <input
                      type="number"
                      value={ticket.maxQuantity}
                      onChange={(e) => {
                        const newTypes = [...ticketTypes]
                        newTypes[index].maxQuantity = e.target.value
                        setTicketTypes(newTypes)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="100"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge (optional)</label>
                    <input
                      type="text"
                      value={ticket.badge}
                      onChange={(e) => {
                        const newTypes = [...ticketTypes]
                        newTypes[index].badge = e.target.value
                        setTicketTypes(newTypes)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Best Value, Most Popular"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
                  <textarea
                    value={ticket.benefits.join('\n')}
                    onChange={(e) => {
                      const newTypes = [...ticketTypes]
                      newTypes[index].benefits = e.target.value.split('\n').filter(b => b.trim())
                      setTicketTypes(newTypes)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Event materials\nCertificate of attendance\nNetworking lunch"
                  />
                </div>
                
                {ticketTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newTypes = ticketTypes.filter((_, i) => i !== index)
                      setTicketTypes(newTypes)
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    🗑️ Remove Ticket Type
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                const newId = `ticket${Date.now()}`
                setTicketTypes([...ticketTypes, {
                  id: newId,
                  name: '',
                  description: '',
                  price: '',
                  originalPrice: '',
                  maxQuantity: '',
                  benefits: ['Event materials'],
                  badge: ''
                }])
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors"
            >
              ➕ Add Another Ticket Type
            </button>
          </div>
          
          {/* Featured Benefits */}
          <div className="mb-8">
            <h4 className="text-md font-semibold text-gray-900 mb-4">⭐ Featured Event Benefits</h4>
            <p className="text-sm text-gray-600 mb-3">What will attendees gain from this event? These appear prominently on the event page.</p>
            <div className="space-y-2">
              {featuredBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const newBenefits = [...featuredBenefits]
                      newBenefits[index] = e.target.value
                      setFeaturedBenefits(newBenefits)
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="What attendees will gain from this event"
                  />
                  {featuredBenefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newBenefits = featuredBenefits.filter((_, i) => i !== index)
                        setFeaturedBenefits(newBenefits)
                      }}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFeaturedBenefits([...featuredBenefits, ''])}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                ➕ Add Benefit
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-blue-500 text-lg">💡</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900">Enhanced Event Features</h4>
                <p className="text-sm text-blue-700 mt-1">
                  These enhanced features will automatically create a professional event page with multiple ticket options, 
                  better pricing display, and improved conversion rates for your event.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legacy fields for backward compatibility */}
        <input type="hidden" name="ticketPrice" value={ticketTypes[0]?.price || formData.ticketPrice} />
        <input type="hidden" name="maxTickets" value={ticketTypes[0]?.maxQuantity || formData.maxTickets} />
        
        {/* Status Selection */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Status</label>
          <select 
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          {editingEvent && (
            <button
              type="button"
              onClick={() => {
                resetForm()
                setActiveTab('overview')
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={(e) => handleSubmit(e as any, true)}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Event' : 'Create Event')}
          </button>
        </div>
      </form>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Event Analytics & Reports</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Events</p>
                <p className="text-2xl font-bold text-blue-900">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">
                  GH₵{events.reduce((sum, event) => sum + (event.revenue || 0), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Tickets Sold</p>
                <p className="text-2xl font-bold text-purple-900">
                  {events.reduce((sum, event) => sum + (event.ticket_sales || 0), 0)}
                </p>
              </div>
              <Ticket className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Active Events</p>
                <p className="text-2xl font-bold text-orange-900">
                  {events.filter(e => e.status === 'published' || e.status === 'ongoing').length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
        
        {/* Events Performance Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => {
                  const conversionRate = event.max_tickets ? ((event.ticket_sales || 0) / event.max_tickets * 100).toFixed(1) : '0.0'
                  return (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{new Date(event.start_date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          event.status === 'published' ? 'bg-green-100 text-green-800' :
                          event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.ticket_sales || 0} / {event.max_tickets || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        GH₵{(event.revenue || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conversionRate}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2 inline" />
            Export Report
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            <BarChart3 className="h-4 w-4 mr-2 inline" />
            Detailed Analytics
          </button>
        </div>
      </div>
    </div>
  )

  const renderViewEvent = () => {
    if (!viewingEvent) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center py-8">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Event Selected</h3>
            <p className="text-gray-600 mb-4">Select an event from the overview to view its details.</p>
            <button
              onClick={() => setActiveTab('overview')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Back to Overview
            </button>
          </div>
        </div>
      )
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-GB', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    const formatTime = (startDate: string, endDate: string) => {
      const start = new Date(startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      const end = new Date(endDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      return `${start} - ${end}`
    }

    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setViewingEvent(null)
                setActiveTab('overview')
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Back to Overview
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{viewingEvent.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingEvent.status)}`}>
                  {viewingEvent.status.charAt(0).toUpperCase() + viewingEvent.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  Created {new Date(viewingEvent.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEditEvent(viewingEvent)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Event
            </button>
            <button
              onClick={() => window.open(`/events/${viewingEvent.id}`, '_blank')}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Public Page
            </button>
          </div>
        </div>

        {/* Event Image */}
        {viewingEvent.image_url && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img
              src={viewingEvent.image_url}
              alt={viewingEvent.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{viewingEvent.description || 'No description provided'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date & Time</label>
                    <div className="mt-1 flex items-center text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{formatDate(viewingEvent.start_date)}</span>
                    </div>
                    <div className="mt-1 flex items-center text-gray-900">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{formatTime(viewingEvent.start_date, viewingEvent.end_date)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">End Date & Time</label>
                    <div className="mt-1 flex items-center text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{formatDate(viewingEvent.end_date)}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-1 flex items-center text-gray-900">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{viewingEvent.location}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Venue</label>
                    <p className="mt-1 text-gray-900">{viewingEvent.venue || 'TBA'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Stats & Actions */}
          <div className="space-y-6">
            {/* Ticket Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Price per Ticket</span>
                  <span className="text-lg font-bold text-gray-900">GH₵{viewingEvent.ticket_price || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Max Tickets</span>
                  <span className="text-gray-900">{viewingEvent.max_tickets || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Available</span>
                  <span className="text-gray-900">{viewingEvent.available_tickets || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Sold</span>
                  <span className="text-gray-900">{(viewingEvent.max_tickets || 0) - (viewingEvent.available_tickets || 0)}</span>
                </div>
                {viewingEvent.ticket_price && viewingEvent.ticket_price > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                    <span className="text-lg font-bold text-green-600">
                      GH₵{((viewingEvent.max_tickets || 0) - (viewingEvent.available_tickets || 0)) * (viewingEvent.ticket_price || 0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleEditEvent(viewingEvent)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Event
                </button>
                <button
                  onClick={() => window.open(`/events/${viewingEvent.id}`, '_blank')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Page
                </button>
                <button
                  onClick={() => handleDeleteEvent(viewingEvent.id)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTicketManagement = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">🎫 Ticket Management</h2>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500">
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4 mr-2 inline" />
              Export Tickets
            </button>
          </div>
        </div>
        
        {/* Ticket Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Tickets Available</p>
                <p className="text-2xl font-bold text-blue-900">
                  {events.reduce((sum, event) => sum + (event.max_tickets || 0), 0)}
                </p>
              </div>
              <Ticket className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Tickets Sold</p>
                <p className="text-2xl font-bold text-green-900">
                  {events.reduce((sum, event) => sum + (event.ticket_sales || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Tickets Remaining</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {events.reduce((sum, event) => sum + ((event.max_tickets || 0) - (event.ticket_sales || 0)), 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
        
        {/* Ticket Sales by Event */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Sales by Event</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => {
                  const remaining = (event.max_tickets || 0) - (event.ticket_sales || 0)
                  const soldPercentage = event.max_tickets ? ((event.ticket_sales || 0) / event.max_tickets * 100) : 0
                  return (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{new Date(event.start_date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        GH₵{event.ticket_price || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.max_tickets || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.ticket_sales || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">{remaining}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                soldPercentage > 80 ? 'bg-red-600' : 
                                soldPercentage > 50 ? 'bg-yellow-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${Math.min(100, soldPercentage)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          remaining === 0 ? 'bg-red-100 text-red-800' :
                          remaining < 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {remaining === 0 ? 'Sold Out' : remaining < 10 ? 'Low Stock' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">View Sales</button>
                        <button className="text-green-600 hover:text-green-900">Edit Pricing</button>
                        <button className="text-gray-600 hover:text-gray-900">More</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Ticket Actions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2 inline" />
              Bulk Add Tickets
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              <Settings className="h-4 w-4 mr-2 inline" />
              Pricing Rules
            </button>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
              <Filter className="h-4 w-4 mr-2 inline" />
              Refund Requests
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
              <Download className="h-4 w-4 mr-2 inline" />
              Sales Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAttendeeManagement = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">👥 Attendee Management</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search attendees..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500">
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4 mr-2 inline" />
              Export List
            </button>
          </div>
        </div>
        
        {/* Attendee Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Attendees</p>
                <p className="text-2xl font-bold text-blue-900">
                  {events.reduce((sum, event) => sum + (event.ticket_sales || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Checked In</p>
                <p className="text-2xl font-bold text-green-900">
                  {Math.floor(events.reduce((sum, event) => sum + (event.ticket_sales || 0), 0) * 0.75)}
                </p>
              </div>
              <CheckIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {Math.floor(events.reduce((sum, event) => sum + (event.ticket_sales || 0), 0) * 0.15)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">No Show</p>
                <p className="text-2xl font-bold text-red-900">
                  {Math.floor(events.reduce((sum, event) => sum + (event.ticket_sales || 0), 0) * 0.1)}
                </p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
        
        {/* Attendee List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Attendees</h3>
            <div className="flex gap-2">
              <button className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded">
                <Filter className="h-4 w-4 mr-1 inline" />
                Filter
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded">
                Sort
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample attendee data */}
                {[
                  { name: 'John Doe', email: 'john@example.com', event: 'Youth Leadership Summit', ticketType: 'Regular', date: '2024-01-15', status: 'confirmed' },
                  { name: 'Jane Smith', email: 'jane@example.com', event: 'Digital Skills Workshop', ticketType: 'Early Bird', date: '2024-01-14', status: 'checked-in' },
                  { name: 'Mike Johnson', email: 'mike@example.com', event: 'Entrepreneurship Bootcamp', ticketType: 'VIP', date: '2024-01-13', status: 'pending' },
                  { name: 'Sarah Wilson', email: 'sarah@example.com', event: 'Youth Leadership Summit', ticketType: 'Student', date: '2024-01-12', status: 'confirmed' },
                  { name: 'David Brown', email: 'david@example.com', event: 'Community Impact Awards', ticketType: 'Regular', date: '2024-01-11', status: 'no-show' }
                ].map((attendee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {attendee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                          <div className="text-sm text-gray-500">{attendee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendee.event}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {attendee.ticketType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(attendee.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        attendee.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        attendee.status === 'checked-in' ? 'bg-blue-100 text-blue-800' :
                        attendee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {attendee.status === 'checked-in' ? 'Checked In' :
                         attendee.status === 'no-show' ? 'No Show' :
                         attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-green-600 hover:text-green-900">Check In</button>
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Contact</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Attendee Management Tools */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Attendee Tools</h4>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <Users className="h-4 w-4 mr-2 inline" />
              Bulk Check-In
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              <Mail className="h-4 w-4 mr-2 inline" />
              Send Reminder
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4 mr-2 inline" />
              Name Badges
            </button>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
              <BarChart3 className="h-4 w-4 mr-2 inline" />
              Attendance Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview()
      case 'create': return renderCreateEvent()
      case 'view': return renderViewEvent()
      case 'analytics': return renderAnalytics()
      case 'tickets': return renderTicketManagement()
      case 'attendees': return renderAttendeeManagement()
      default: return renderOverview()
    }
  }

  // Don't render content while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Shield className="h-3 w-3 mr-1" />
              Admin Only
            </span>
          </div>
        </div>
        <p className="text-gray-600">Manage your events, tickets, and attendees all in one place</p>
      </div>

      {/* Tabs */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.filter(tab => tab.id !== 'view' || viewingEvent).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2 inline" />
                {tab.label}{tab.id === 'view' && viewingEvent ? `: ${viewingEvent.title}` : ''}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}