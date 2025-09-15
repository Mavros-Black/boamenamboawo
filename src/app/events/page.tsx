'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Users, Ticket, Heart } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  venue: string
  status: 'published' | 'ongoing' | 'completed'
  ticket_price: number
  max_tickets: number
  available_tickets: number
  image_url?: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      // Use actual API call
      const response = await fetch('/api/events')
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const { events: apiEvents } = await response.json()
      setEvents(apiEvents || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to load events')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return { color: 'text-green-600', text: 'Available' }
    if (percentage > 20) return { color: 'text-yellow-600', text: 'Limited' }
    if (percentage > 0) return { color: 'text-red-600', text: 'Almost Sold Out' }
    return { color: 'text-gray-600', text: 'Sold Out' }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Join us for inspiring events designed to empower youth and build stronger communities. 
            Get your tickets now for an unforgettable experience!
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover transformative events across Ghana - from tech workshops to leadership summits. 
              Join thousands of young people building a better future together.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                💻 Technology & Innovation
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                🌱 Leadership Development
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                🎨 Creative Arts
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                💰 Financial Literacy
              </span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                🧠 Mental Wellbeing
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading events...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">Error: {error}</p>
              <button 
                onClick={fetchEvents} 
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
              <p className="text-gray-500">Check back soon for upcoming events!</p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && events.length > 0 && (
            <>
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600">
                  🎆 <strong>{events.length}</strong> exciting events available across Ghana
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const availability = getAvailabilityStatus(event.available_tickets, event.max_tickets)
                return (
                  <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Event Image */}
                    <div className="h-48 bg-gray-200">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="p-6">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${availability.color} bg-gray-100`}>
                          {availability.text}
                        </span>
                        <span className="text-lg font-bold text-green-600">GH₵{event.ticket_price}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-4">{event.description}</p>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatTime(event.start_date)} - {formatTime(event.end_date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.venue}, {event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Ticket className="h-4 w-4 mr-2" />
                          <span>{event.available_tickets} of {event.max_tickets} tickets available</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {event.available_tickets > 0 ? (
                        <Link
                          href={`/events/${event.id}`}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-center font-medium transition-colors block"
                        >
                          <Ticket className="h-4 w-4 mr-2 inline" />
                          Buy Tickets
                        </Link>
                      ) : (
                        <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-md text-center font-medium">
                          Sold Out
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Don't miss out on upcoming events! Follow us on social media and 
            subscribe to our newsletter for the latest updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/programs"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}