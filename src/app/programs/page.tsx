'use client'

import Link from 'next/link'
import { Calendar, Users, MapPin, Target, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Program {
  id: string
  title: string
  description: string
  category: string
  status: string
  location: string
  max_participants: number
  current_participants: number
  start_date: string
  end_date: string
  created_at: string
  image_url?: string
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/programs')
      
      if (!response.ok) {
        throw new Error('Failed to fetch programs')
      }
      
      const { programs: apiPrograms } = await response.json()
      setPrograms(apiPrograms || [])
    } catch (error) {
      console.error('Error fetching programs:', error)
      setError('Failed to load programs')
      // Fallback to empty array
      setPrograms([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to calculate duration
  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 'TBD'
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months`
    return `${Math.ceil(diffDays / 365)} years`
  }

  // Helper function to determine if program needs support
  const needsSupport = (program: Program) => {
    return program.status === 'active' && program.current_participants < program.max_participants
  }

  // Helper function to generate impact statement
  const generateImpact = (program: Program) => {
    if (program.status === 'completed') {
      return `${program.current_participants} youth empowered`
    }
    return `${program.current_participants}/${program.max_participants} participants enrolled`
  }

  // const categories = ['All', 'Technology', 'Business', 'Agriculture', 'Education', 'Health', 'Arts']

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Programs</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover our comprehensive range of programs designed to empower youth 
            and create lasting positive change in communities across Ghana.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">25</div>
              <div className="text-gray-600">Total Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15,000+</div>
              <div className="text-gray-600">Youth Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {programs.filter(p => p.status === 'active').length}
              </div>
              <div className="text-gray-600">Active Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current & Past Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our programs are designed to address the diverse needs of young people 
              and create opportunities for growth and development.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading programs...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">Error: {error}</p>
              <button 
                onClick={fetchPrograms} 
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && programs.length === 0 && (
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No programs available</h3>
              <p className="text-gray-500">Check back soon for new programs!</p>
            </div>
          )}

          {/* Programs Grid */}
          {!loading && !error && programs.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Program Image */}
                  <div className="h-48 bg-gradient-to-r from-green-100 to-blue-100">
                    {program.image_url ? (
                      <img 
                        src={program.image_url} 
                        alt={program.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentNode as HTMLElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100">
                                <svg class="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100">
                        <Target className="h-16 w-16 text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Program Content */}
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        program.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {program.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{program.category}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">{program.description}</p>

                    {/* Program Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-semibold text-gray-900">{program.current_participants}/{program.max_participants} participants</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{program.location || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{calculateDuration(program.start_date, program.end_date)}</span>
                      </div>
                    </div>

                    {/* Impact */}
                    <div className="bg-green-50 p-3 rounded-md mb-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-700">{generateImpact(program)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {needsSupport(program) ? (
                      <Link
                        href={`/programs/${program.id}`}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-center font-medium transition-colors block"
                      >
                        Support This Project
                      </Link>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-md text-center font-medium">
                        {program.status === 'completed' ? 'Program Completed' : 'Program Full'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Support Our Programs</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your support helps us continue our mission of empowering youth and building 
            stronger communities. Every contribution makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Make a Donation
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
