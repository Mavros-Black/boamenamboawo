'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import NextImage from 'next/image'
import PaystackButton from '@/components/PaystackButton'
import { 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  MapPin as MapPinIcon, 
  Users as UserGroupIcon,
  Ticket as TicketIcon,
  ArrowLeft as ArrowLeftIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  User as UserIcon,
  Mail as EnvelopeIcon,
  Phone as PhoneIcon,
  Check as CheckIcon,
  Star as StarIcon,
  Tag as TagIcon
} from 'lucide-react'

// Enhanced interfaces
interface TicketType {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  available_quantity: number
  benefits: string[]
  badge?: string
  availability_status: 'available' | 'limited' | 'sold_out'
}

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  venue: string
  image_url?: string
  ticket_price: number
  max_tickets: number
  available_tickets: number
  status: string
  created_at: string
  updated_at: string
  // Enhanced fields
  ticket_types?: TicketType[]
  featured_benefits?: string[]
}

export default function EventDetail() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTicketType, setSelectedTicketType] = useState<string>('')
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    dietary_requirements: ''
  })

  // Fetch event data from API and enhance it
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      
      try {
        const response = await fetch(`/api/events?status=all`)
        const data = await response.json()
        
        if (response.ok && data.events) {
          const foundEvent = data.events.find((e: Event) => e.id === eventId)
          if (foundEvent) {
            const enhancedEvent = enhanceEventWithTicketTypes(foundEvent)
            setEvent(enhancedEvent)
            // Auto-select first available ticket type
            if (enhancedEvent.ticket_types && enhancedEvent.ticket_types.length > 0) {
              const firstAvailable = enhancedEvent.ticket_types.find(tt => tt.availability_status === 'available')
              if (firstAvailable) {
                setSelectedTicketType(firstAvailable.id)
              }
            }
          } else {
            setEvent(null)
          }
        } else {
          setEvent(null)
        }
      } catch (error) {
        console.error('Error fetching event:', error)
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  // Function to enhance event with multiple ticket types
  const enhanceEventWithTicketTypes = (basicEvent: any): Event => {
    let ticketTypes: TicketType[] = []
    let featuredBenefits: string[] = []
    
    if (basicEvent.id === 'youth-leadership-summit-2024') {
      ticketTypes = [
        {
          id: 'early-bird',
          name: 'Early Bird',
          description: 'Limited time special pricing - Save 30%!',
          price: 35,
          original_price: 50,
          available_quantity: 45,
          benefits: ['Event materials', 'Welcome kit', 'Networking lunch', 'Digital certificates'],
          availability_status: 'available',
          badge: 'Best Value'
        },
        {
          id: 'regular',
          name: 'Regular',
          description: 'Standard admission with full access',
          price: 50,
          available_quantity: 156,
          benefits: ['Event materials', 'Networking lunch', 'Digital certificates'],
          availability_status: 'available'
        },
        {
          id: 'student',
          name: 'Student',
          description: 'Special rate for students (ID required)',
          price: 25,
          original_price: 50,
          available_quantity: 23,
          benefits: ['Event materials', 'Student networking session', 'Digital certificates'],
          availability_status: 'limited',
          badge: 'Student Price'
        },
        {
          id: 'vip',
          name: 'VIP Experience',
          description: 'Premium access with exclusive benefits',
          price: 100,
          available_quantity: 8,
          benefits: [
            'Priority seating',
            'VIP lunch with speakers',
            'Exclusive networking reception',
            'Premium gift bag',
            'One-on-one mentorship session',
            'Certificate of completion'
          ],
          availability_status: 'limited',
          badge: 'Most Popular'
        }
      ]
      
      featuredBenefits = [
        'Expert-led sessions by industry leaders',
        'Networking opportunities with like-minded peers',
        'Practical tools and frameworks you can implement',
        'Digital certificates and completion recognition',
        'Access to exclusive resources and materials'
      ]
    } else {
      // Default ticket types for other events
      ticketTypes = [
        {
          id: 'regular',
          name: 'Regular',
          description: 'Standard admission',
          price: basicEvent.ticket_price || 30,
          available_quantity: basicEvent.available_tickets || 50,
          benefits: ['Event materials', 'Certificate of attendance'],
          availability_status: 'available'
        },
        {
          id: 'student',
          name: 'Student',
          description: 'Discounted rate for students',
          price: Math.round((basicEvent.ticket_price || 30) * 0.7),
          available_quantity: Math.round((basicEvent.available_tickets || 50) * 0.3),
          benefits: ['Event materials', 'Student networking'],
          availability_status: 'available',
          badge: 'Student Price'
        }
      ]
      
      featuredBenefits = [
        'Learn from industry experts',
        'Network with professionals',
        'Gain practical knowledge',
        'Receive completion certificate'
      ]
    }

    return {
      ...basicEvent,
      ticket_types: ticketTypes,
      featured_benefits: featuredBenefits
    }
  }

  const getSelectedTicketType = () => {
    return event?.ticket_types?.find(tt => tt.id === selectedTicketType)
  }

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return { color: 'text-green-600', text: 'Available', bgColor: 'bg-green-100' }
    if (percentage > 20) return { color: 'text-yellow-600', text: 'Limited', bgColor: 'bg-yellow-100' }
    if (percentage > 0) return { color: 'text-red-600', text: 'Almost Sold Out', bgColor: 'bg-red-100' }
    return { color: 'text-gray-600', text: 'Sold Out', bgColor: 'bg-gray-100' }
  }

  const calculateTotal = () => {
    const ticketType = getSelectedTicketType()
    if (!ticketType) return 0
    
    const subtotal = ticketType.price * ticketQuantity
    const discount = subtotal * (promoDiscount / 100)
    return subtotal - discount
  }

  const handleQuantityChange = (change: number) => {
    const ticketType = getSelectedTicketType()
    if (!ticketType) return
    
    const newQuantity = ticketQuantity + change
    if (newQuantity >= 1 && newQuantity <= Math.min(10, ticketType.available_quantity)) {
      setTicketQuantity(newQuantity)
    }
  }

  const handlePromoCodeApply = () => {
    // Simulate promo code validation
    if (promoCode.toUpperCase() === 'YOUTH2025') {
      setPromoDiscount(15)
    } else if (promoCode.toUpperCase() === 'STUDENT10') {
      setPromoDiscount(10)
    } else {
      setPromoDiscount(0)
      alert('Invalid promo code')
    }
  }

  const handlePurchase = () => {
    if (!selectedTicketType) {
      alert('Please select a ticket type')
      return
    }
    setShowCheckoutForm(true)
  }

  const handlePaymentSuccess = async (reference: string) => {
    if (!event) return
    
    setIsProcessing(true)
    
    try {
      const ticketType = getSelectedTicketType()
      const originalAmount = (ticketType?.price || 0) * ticketQuantity
      const discountAmount = originalAmount * (promoDiscount / 100)
      
      // Create purchase record with enhanced data
      const purchaseResponse = await fetch(`/api/events/${event.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: ticketQuantity,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          payment_reference: reference,
          // Enhanced fields
          ticket_type_name: ticketType?.name,
          original_amount: originalAmount,
          discount_amount: discountAmount,
          promo_code: promoCode || null,
          registration_data: {
            organization: customerInfo.organization,
            dietary_requirements: customerInfo.dietary_requirements
          }
        })
      })

      const purchaseData = await purchaseResponse.json()

      if (purchaseResponse.ok) {
        // Redirect to payment callback for verification
        router.push(`/payment/callback?reference=${reference}`)
      } else {
        throw new Error(purchaseData.error || 'Purchase failed')
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setIsProcessing(false)
      setShowCheckoutForm(false)
    }
  }

  const handlePaymentClose = () => {
    setShowCheckoutForm(false)
    setIsProcessing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const selectedTicket = getSelectedTicketType()
  const totalPrice = calculateTotal()
  const availability = selectedTicket 
    ? { 
        color: selectedTicket.availability_status === 'available' ? 'text-green-600' : 
               selectedTicket.availability_status === 'limited' ? 'text-yellow-600' : 'text-red-600',
        text: selectedTicket.availability_status === 'available' ? 'Available' :
              selectedTicket.availability_status === 'limited' ? 'Limited' : 'Sold Out',
        bgColor: selectedTicket.availability_status === 'available' ? 'bg-green-100' :
                 selectedTicket.availability_status === 'limited' ? 'bg-yellow-100' : 'bg-red-100'
      }
    : getAvailabilityStatus(event?.available_tickets || 0, event?.max_tickets || 100)

  // Helper functions for display
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
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden mb-8">
              <NextImage
                src={event.image_url || '/api/placeholder/800/400'}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${availability.bgColor} ${availability.color}`}>
                  {availability.text}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-3">
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-lg text-gray-600">{event.description}</p>
              </div>

              {/* Event Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{formatTime(event.start_date, event.end_date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{event.venue || event.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <UserGroupIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Boa Me Youth Empowerment</span>
                </div>
              </div>

              {/* Full Description */}
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              </div>

              {/* Featured Benefits */}
              {event.featured_benefits && event.featured_benefits.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Gain</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {event.featured_benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start">
                        <StarIcon className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers Section for Youth Leadership Summit */}
              {event.id === 'youth-leadership-summit-2024' && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Featured Speakers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          KA
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold text-gray-900">Kwame Asante</h4>
                          <p className="text-sm text-gray-600">CEO, Youth Empowerment Ghana</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Expert in youth development with 15+ years of experience in leadership training and mentorship programs.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          AA
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold text-gray-900">Ama Aidoo</h4>
                          <p className="text-sm text-gray-600">Leadership Coach & Author</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        International speaker and author of "Leading from Within". Specializes in emotional intelligence and team building.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          JM
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold text-gray-900">Joseph Mensah</h4>
                          <p className="text-sm text-gray-600">Tech Entrepreneur</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Founder of 3 successful startups. Will share insights on innovation, entrepreneurship, and digital leadership.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          EP
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold text-gray-900">Efua Poku</h4>
                          <p className="text-sm text-gray-600">Social Impact Leader</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Director of Community Development at Global Impact Initiative. Expert in project management and social change.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Agenda for Youth Leadership Summit */}
              {event.id === 'youth-leadership-summit-2024' && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Agenda</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">Registration & Welcome</h4>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">8:00 - 9:00 AM</span>
                      </div>
                      <p className="text-sm text-gray-700">Check-in, welcome kit distribution, and networking breakfast</p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">Opening Keynote: Leadership in the Digital Age</h4>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">9:00 - 10:30 AM</span>
                      </div>
                      <p className="text-sm text-gray-700">Kwame Asante explores modern leadership challenges and opportunities</p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">Workshop: Emotional Intelligence</h4>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">11:00 AM - 12:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-700">Interactive session with Ama Aidoo on building emotional intelligence</p>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">Networking Lunch</h4>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">12:30 - 1:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-700">Connect with fellow leaders over lunch (VIP guests join speakers)</p>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">Panel: Innovation & Entrepreneurship</h4>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">1:30 - 3:00 PM</span>
                      </div>
                      <p className="text-sm text-gray-700">Joseph Mensah leads discussion on building successful ventures</p>
                    </div>
                    
                    <div className="border-l-4 border-pink-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">Workshop: Project Management for Change</h4>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">3:30 - 5:00 PM</span>
                      </div>
                      <p className="text-sm text-gray-700">Efua Poku shares tools and frameworks for managing impactful projects</p>
                    </div>
                    
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">Closing & Certificates</h4>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">5:00 - 5:30 PM</span>
                      </div>
                      <p className="text-sm text-gray-700">Wrap-up, certificate presentation, and final networking</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Ticket Purchase */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get Your Tickets</h3>
              
              {/* Ticket Types Selection */}
              {event.ticket_types && event.ticket_types.length > 0 ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Ticket Type
                  </label>
                  <div className="space-y-3">
                    {event.ticket_types.map((ticketType) => (
                      <div
                        key={ticketType.id}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTicketType === ticketType.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${
                          ticketType.availability_status === 'sold_out'
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        onClick={() => {
                          if (ticketType.availability_status !== 'sold_out') {
                            setSelectedTicketType(ticketType.id)
                            setTicketQuantity(1)
                          }
                        }}
                      >
                        {ticketType.badge && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {ticketType.badge}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{ticketType.name}</h4>
                            <p className="text-sm text-gray-600">{ticketType.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              GH₵{ticketType.price}
                            </div>
                            {ticketType.original_price && ticketType.original_price > ticketType.price && (
                              <div className="text-sm text-gray-500 line-through">
                                GH₵{ticketType.original_price}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Benefits */}
                        <div className="mb-3">
                          <ul className="text-xs text-gray-600 space-y-1">
                            {ticketType.benefits.slice(0, 3).map((benefit, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckIcon className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                            {ticketType.benefits.length > 3 && (
                              <li className="text-gray-500">+{ticketType.benefits.length - 3} more benefits</li>
                            )}
                          </ul>
                        </div>
                        
                        {/* Availability */}
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-medium ${
                            ticketType.availability_status === 'available' ? 'text-green-600' :
                            ticketType.availability_status === 'limited' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {ticketType.availability_status === 'available' ? 'Available' :
                             ticketType.availability_status === 'limited' ? 'Limited' : 'Sold Out'}
                          </span>
                          <span className="text-gray-500">
                            {ticketType.available_quantity} left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Fallback to basic pricing */
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    GH₵{event.ticket_price}
                    <span className="text-lg font-normal text-gray-600"> per ticket</span>
                  </div>
                </div>
              )}

              {/* Selected Ticket Info & Availability */}
              {selectedTicket && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Selected: {selectedTicket.name}</span>
                    <span className={`text-sm font-medium ${availability.color}`}>
                      {selectedTicket.available_quantity} left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedTicket.available_quantity / 100) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 font-medium mb-2">What's included:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {selectedTicket.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckIcon className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="h-4 w-4 inline mr-1" />
                  Promo Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter promo code"
                  />
                  <button
                    onClick={handlePromoCodeApply}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoDiscount > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {promoDiscount}% discount applied!
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Try: YOUTH2025 (15% off) or STUDENT10 (10% off)
                </p>
              </div>

              {event.available_tickets > 0 ? (
                <>
                  {/* Quantity Selector */}
                  {selectedTicket && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Number of Tickets
                      </label>
                      <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          disabled={ticketQuantity <= 1}
                          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-semibold">{ticketQuantity}</span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          disabled={ticketQuantity >= Math.min(10, selectedTicket.available_quantity)}
                          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum {Math.min(10, selectedTicket.available_quantity)} tickets per order
                      </p>
                    </div>
                  )}

                  {/* Total Price */}
                  {selectedTicket && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {ticketQuantity} × {selectedTicket.name}
                          </span>
                          <span className="text-sm text-gray-900">
                            GH₵{selectedTicket.price * ticketQuantity}
                          </span>
                        </div>
                        
                        {promoDiscount > 0 && (
                          <div className="flex justify-between items-center text-green-600">
                            <span className="text-sm">
                              Discount ({promoCode} - {promoDiscount}%)
                            </span>
                            <span className="text-sm">
                              -GH₵{((selectedTicket.price * ticketQuantity) * (promoDiscount / 100)).toFixed(2)}
                            </span>
                          </div>
                        )}
                        
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="text-lg font-medium text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-gray-900">GH₵{totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Information Form */}
                  {showCheckoutForm && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <UserIcon className="h-4 w-4 inline mr-2" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <PhoneIcon className="h-4 w-4 inline mr-2" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your phone number"
                          />
                        </div>
                        
                        {/* Enhanced Registration Fields */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Organization (Optional)
                          </label>
                          <input
                            type="text"
                            value={customerInfo.organization}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, organization: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Company, school, or organization"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dietary Requirements (Optional)
                          </label>
                          <input
                            type="text"
                            value={customerInfo.dietary_requirements}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, dietary_requirements: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Any dietary restrictions or allergies"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Purchase Button */}
                  {!showCheckoutForm ? (
                    <button
                      onClick={handlePurchase}
                      disabled={isProcessing || !selectedTicketType || selectedTicket?.availability_status === 'sold_out'}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? 'Processing...' : 
                       !selectedTicketType ? 'Select a Ticket Type' :
                       selectedTicket?.availability_status === 'sold_out' ? 'Sold Out' :
                       'Proceed to Checkout'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <PaystackButton
                        amount={totalPrice}
                        email={customerInfo.email}
                        onSuccess={handlePaymentSuccess}
                        onClose={handlePaymentClose}
                        disabled={!customerInfo.name || !customerInfo.email || isProcessing}
                        metadata={{
                          event_id: event.id,
                          event_title: event.title,
                          quantity: ticketQuantity,
                          customer_name: customerInfo.name,
                          customer_phone: customerInfo.phone
                        }}
                      >
                        {isProcessing ? 'Processing...' : `Pay GH₵${totalPrice} with Paystack`}
                      </PaystackButton>
                      <button
                        onClick={() => setShowCheckoutForm(false)}
                        className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Secure payment powered by Paystack
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg p-6 mb-4">
                    <TicketIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Sold Out</h4>
                    <p className="text-gray-600">
                      All tickets for this event have been sold.
                    </p>
                  </div>
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                  >
                    No Tickets Available
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}