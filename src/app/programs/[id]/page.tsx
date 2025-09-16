'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Calendar, Users, MapPin, Target, Heart, Edit, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import PaystackButton from '@/components/PaystackButton'

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

export default function SingleProgramPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    current_participants: 0,
    max_participants: 0
  })
  const [donationAmount, setDonationAmount] = useState(50)
  const [showDonationForm, setShowDonationForm] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProgram()
    }
  }, [id])

  const fetchProgram = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/programs`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch program')
      }
      
      const { programs: allPrograms } = await response.json()
      const foundProgram = allPrograms.find((p: Program) => p.id === id)
      
      if (!foundProgram) {
        setError('Program not found')
        return
      }
      
      setProgram(foundProgram)
      setEditData({
        current_participants: foundProgram.current_participants,
        max_participants: foundProgram.max_participants
      })
    } catch (error) {
      console.error('Error fetching program:', error)
      setError('Failed to load program')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/programs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: program?.id,
          title: program?.title, // Add title to satisfy API requirement
          current_participants: editData.current_participants,
          max_participants: editData.max_participants
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update program')
      }

      const { program: updatedProgram } = await response.json()
      setProgram(updatedProgram)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating program:', error)
      alert('Failed to update program')
    }
  }

  const handleDonationSuccess = (reference: string) => {
    // Handle successful donation
    console.log('Donation successful with reference:', reference)
    setShowDonationForm(false)
    // You might want to save this donation to your database
  }

  const handleDonationClose = () => {
    setShowDonationForm(false)
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

  // Helper function to generate impact statement
  const generateImpact = () => {
    if (!program) return ''
    if (program.status === 'completed') {
      return `${program.current_participants} youth empowered`
    }
    return `${program.current_participants}/${program.max_participants} participants enrolled`
  }

  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Not Found</h1>
          <p className="text-gray-600 mb-6">The program you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/programs" 
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            View All Programs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Program Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/programs" 
            className="inline-flex items-center text-green-200 hover:text-white mb-6"
          >
            <span className="mr-2">←</span> Back to Programs
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Program Image */}
            <div className="md:w-1/2">
              <div className="bg-gray-200 rounded-lg overflow-hidden h-80">
                {program.image_url ? (
                  <img 
                    src={program.image_url} 
                    alt={program.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const placeholder = document.createElement('div')
                      placeholder.className = 'w-full h-full flex items-center justify-center bg-gray-100'
                      placeholder.innerHTML = '<svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
                      target.parentNode?.appendChild(placeholder)
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Target className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Program Info */}
            <div className="md:w-1/2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    program.status === 'active' 
                      ? 'bg-white text-green-800' 
                      : program.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {program.status === 'active' ? 'Active' : program.status === 'completed' ? 'Completed' : 'Inactive'}
                  </span>
                  <h1 className="text-3xl font-bold mt-4 mb-2">{program.title}</h1>
                  <p className="text-green-100 text-lg">{program.category}</p>
                </div>
                
                {/* {isAdmin && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                  </button>
                )} */}
              </div>
              
              <p className="text-xl text-green-50 mb-6">{program.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-green-50">
                  <Calendar className="h-5 w-5 mr-3 text-green-200" />
                  <span>{new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-green-50">
                  <MapPin className="h-5 w-5 mr-3 text-green-200" />
                  <span>{program.location || 'Location TBD'}</span>
                </div>
                <div className="flex items-center text-green-50">
                  <Users className="h-5 w-5 mr-3 text-green-200" />
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={editData.current_participants}
                        onChange={(e) => setEditData({...editData, current_participants: parseInt(e.target.value) || 0})}
                        className="w-20 px-2 py-1 text-gray-900 rounded"
                      />
                      <span className="text-green-100">/</span>
                      {/* <input
                        type="number"
                        min="0"
                        value={editData.max_participants}
                        onChange={(e) => setEditData({...editData, max_participants: parseInt(e.target.value) || 0})}
                        className="w-20 px-2 py-1 text-gray-900 rounded"
                      />
                      {isEditing && (
                        <button
                          onClick={handleSave}
                          className="ml-2 p-1 bg-green-500 rounded-full hover:bg-green-400"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      )} */}
                    </div>
                  ) : (
                    <span className="text-lg font-medium text-white">{program.current_participants}/{program.max_participants} participants</span>
                  )}
                </div>
                <div className="flex items-center text-green-50">
                  <Target className="h-5 w-5 mr-3 text-green-200" />
                  <span>{calculateDuration(program.start_date, program.end_date)}</span>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700">Impact</span>
                    <Heart className="h-5 w-5 text-red-400" />
                  </div>
                  <p className="text-black font-bold text-xl">{generateImpact()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support This Program</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help us continue empowering youth by supporting this program. Your contribution makes a real difference.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                      donationAmount === amount
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    GH₵ {amount}
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 "></span>
                  <input
                    type="number"
                    min="1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setShowDonationForm(true)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Donate GH₵ {donationAmount} Now
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                Your donation supports {program.title} and helps empower more youth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Support {program.title}</h3>
              <button
                onClick={handleDonationClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Donation Amount: GH₵ {donationAmount}</p>
              <p className="text-sm text-gray-500">
                Your contribution will directly support {program.title} and help empower youth in our community.
              </p>
            </div>
            
            <PaystackButton
              amount={donationAmount * 100} // Paystack expects amount in kobo/lowest denomination
              email={user?.email || ''}
              onSuccess={handleDonationSuccess}
              onClose={handleDonationClose}
              metadata={{
                programId: program?.id,
                programTitle: program?.title
              }}
            >
              Donate GH₵ {donationAmount} Now
            </PaystackButton>
          </div>
        </div>
      )}
    </div>
  )
}