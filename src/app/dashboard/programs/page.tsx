'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Calendar, Users, Target } from 'lucide-react'

interface Program {
  id: string
  title: string
  description: string
  category: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants: number
  status: 'active' | 'inactive' | 'completed'
  location: string
  created_at: string
}

export default function ProgramsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    start_date: '',
    end_date: '',
    max_participants: '',
    location: '',
    status: 'active'
  })

  useEffect(() => {
    const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      router.push('/dashboard/user')
      return
    }

    fetchPrograms()
  }, [user, router])

  const fetchPrograms = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockPrograms = [
        {
          id: "1",
          title: "Youth Leadership Training",
          description: "Comprehensive leadership development program for young people aged 18-25",
          category: "Leadership",
          start_date: "2025-09-01",
          end_date: "2025-12-01",
          max_participants: 50,
          current_participants: 35,
          status: "active" as const,
          location: "Accra, Ghana",
          created_at: "2025-08-21T10:00:00Z"
        },
        {
          id: "2",
          title: "Digital Skills Workshop",
          description: "Learn essential digital skills including coding, design, and digital marketing",
          category: "Technology",
          start_date: "2025-08-15",
          end_date: "2025-10-15",
          max_participants: 30,
          current_participants: 30,
          status: "active" as const,
          location: "Kumasi, Ghana",
          created_at: "2025-08-10T10:00:00Z"
        },
        {
          id: "3",
          title: "Entrepreneurship Bootcamp",
          description: "Intensive program to help young entrepreneurs start and grow their businesses",
          category: "Business",
          start_date: "2025-07-01",
          end_date: "2025-08-01",
          max_participants: 25,
          current_participants: 25,
          status: "completed" as const,
          location: "Accra, Ghana",
          created_at: "2025-06-15T10:00:00Z"
        }
      ]
      
      setPrograms(mockPrograms)
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingProgram) {
        // Update existing program
        const updatedPrograms = programs.map(program =>
          program.id === editingProgram.id
            ? { ...program, ...formData, max_participants: parseInt(formData.max_participants) }
            : program
        )
        setPrograms(updatedPrograms)
        alert('Program updated successfully!')
      } else {
        // Create new program
        const newProgram: Program = {
          id: Date.now().toString(),
          ...formData,
          max_participants: parseInt(formData.max_participants),
          current_participants: 0,
          created_at: new Date().toISOString()
        }
        setPrograms(prev => [newProgram, ...prev])
        alert('Program created successfully!')
      }
      
      setShowCreateModal(false)
      setEditingProgram(null)
      resetForm()
    } catch (error) {
      console.error('Error saving program:', error)
      alert('Error saving program. Please try again.')
    }
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setFormData({
      title: program.title,
      description: program.description,
      category: program.category,
      start_date: program.start_date,
      end_date: program.end_date,
      max_participants: program.max_participants.toString(),
      location: program.location,
      status: program.status
    })
    setShowCreateModal(true)
  }

  const handleDelete = async (programId: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      setPrograms(prev => prev.filter(program => program.id !== programId))
      alert('Program deleted successfully!')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      start_date: '',
      end_date: '',
      max_participants: '',
      location: '',
      status: 'active'
    })
  }

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const userRole = user?.user_metadata?.role || 'user'
  if (userRole !== 'admin') {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs Management</h1>
          <p className="text-gray-600">Create and manage youth empowerment programs</p>
        </div>
        <button
          onClick={() => {
            setEditingProgram(null)
            resetForm()
            setShowCreateModal(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Programs</p>
              <p className="text-2xl font-bold text-gray-900">
                {programs.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {programs.reduce((sum, p) => sum + p.current_participants, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {programs.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Programs Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading programs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    program.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : program.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {program.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{program.current_participants}/{program.max_participants} participants</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    <span>{program.category}</span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Edit Program"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Delete Program"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredPrograms.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-2 text-gray-600">No programs found</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProgram ? 'Edit Program' : 'Create New Program'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingProgram(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Arts">Arts</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Participants *
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe the program details, objectives, and what participants will learn..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingProgram(null)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
