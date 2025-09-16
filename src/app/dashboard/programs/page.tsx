'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Calendar, Users, Target, Upload, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { compressImage, formatFileSize } from '@/utils/imageCompression'

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
  image_url?: string
  created_at: string
}

export default function ProgramsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
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
    status: 'active',
    image_url: ''
  })

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

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
      setLoading(true)
      
      const response = await fetch('/api/programs')
      if (!response.ok) {
        throw new Error('Failed to fetch programs')
      }
      
      const { programs: apiPrograms } = await response.json()
      
      // Transform API data to match our interface
      const transformedPrograms: Program[] = apiPrograms.map((program: any) => ({
        id: program.id,
        title: program.title,
        description: program.description || '',
        category: program.category || 'General',
        start_date: program.start_date || '',
        end_date: program.end_date || '',
        max_participants: program.max_participants || 0,
        current_participants: program.current_participants || 0,
        status: program.status || 'active',
        location: program.location || '',
        image_url: program.image_url || '',
        created_at: program.created_at
      }))
      
      setPrograms(transformedPrograms)
    } catch (error) {
      console.error('Error fetching programs:', error)
      // Fallback to empty array if API fails
      setPrograms([])
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

  // Image upload handlers
  const handleImageSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        // Show compression progress
        setUploadingImage(true);
        
        // Compress image if it's too large
        let processedFile = file;
        if (file.size > 2 * 1024 * 1024) { // 2MB
          showToast('info', `Compressing image... (${formatFileSize(file.size)} -> smaller)`);
          processedFile = await compressImage(file, 0.8);
        }
        
        setSelectedImage(processedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
          setUploadingImage(false);
        };
        reader.readAsDataURL(processedFile);
      } catch (error) {
        console.error('Image processing error:', error);
        showToast('error', `Error processing image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setUploadingImage(false);
      }
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageSelect(file);
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleImageSelect(file);
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview('')
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }))
  }

  const uploadImage = async (file: File): Promise<string> => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File size (${formatFileSize(file.size)}) must be less than 5MB`);
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'images');
    formData.append('folder', 'programs');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    // Check if response is OK before trying to parse JSON
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse JSON, try to get text
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (e) {
          // If we can't get text, use the status
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.url;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let imageUrl = formData.image_url
      
      // Upload image if selected
      if (selectedImage) {
        setUploadingImage(true)
        try {
          imageUrl = await uploadImage(selectedImage)
        } catch (error) {
          console.error('Image upload error:', error)
          showToast('error', `Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
          setUploadingImage(false)
          return
        } finally {
          setUploadingImage(false)
        }
      }

      if (editingProgram) {
        // Update existing program via API
        try {
          const response = await fetch('/api/programs', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: editingProgram.id,
              title: formData.title,
              description: formData.description,
              category: formData.category,
              start_date: formData.start_date,
              end_date: formData.end_date,
              location: formData.location,
              max_participants: parseInt(formData.max_participants),
              status: formData.status,
              image_url: imageUrl
            })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to update program')
          }

          const { program: apiProgram } = await response.json()
          
          // Transform API response to match our interface
          const updatedProgram: Program = {
            id: apiProgram.id,
            title: apiProgram.title,
            description: apiProgram.description || '',
            category: apiProgram.category || 'General',
            start_date: apiProgram.start_date || '',
            end_date: apiProgram.end_date || '',
            max_participants: apiProgram.max_participants || 0,
            current_participants: apiProgram.current_participants || 0,
            status: (apiProgram.status as 'active' | 'inactive' | 'completed') || 'active',
            location: apiProgram.location || '',
            image_url: apiProgram.image_url || '',
            created_at: apiProgram.created_at
          }
          
          // Update the program in the local state
          setPrograms(prev => prev.map(program => 
            program.id === editingProgram.id ? updatedProgram : program
          ))
          showToast('success', 'Program updated successfully!')
        } catch (error) {
          console.error('Error updating program:', error)
          showToast('error', `Error updating program: ${error instanceof Error ? error.message : 'Unknown error'}`)
          return
        }
      } else {
        // Create new program via API
        const response = await fetch('/api/programs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            start_date: formData.start_date,
            end_date: formData.end_date,
            location: formData.location,
            max_participants: parseInt(formData.max_participants),
            status: formData.status,
            image_url: imageUrl
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create program')
        }

        const { program: apiProgram } = await response.json()
        
        // Transform API response to match our interface
        const newProgram: Program = {
          id: apiProgram.id,
          title: apiProgram.title,
          description: apiProgram.description || '',
          category: apiProgram.category || 'General',
          start_date: apiProgram.start_date || '',
          end_date: apiProgram.end_date || '',
          max_participants: apiProgram.max_participants || 0,
          current_participants: 0, // New programs start with 0 participants
          status: (apiProgram.status as 'active' | 'inactive' | 'completed') || 'active',
          location: apiProgram.location || '',
          image_url: apiProgram.image_url || '',
          created_at: apiProgram.created_at
        }
        
        setPrograms(prev => [newProgram, ...prev])
        showToast('success', 'Program created successfully!')
      }
      
      setShowCreateModal(false)
      setEditingProgram(null)
      resetForm()
    } catch (error) {
      console.error('Error saving program:', error)
      showToast('error', `Error saving program: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
      status: program.status,
      image_url: program.image_url || ''
    })
    setImagePreview(program.image_url || '')
    setSelectedImage(null)
    setShowCreateModal(true)
  }

  const handleDelete = async (programId: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      setPrograms(prev => prev.filter(program => program.id !== programId))
      showToast('success', 'Program deleted successfully!')
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
      status: 'active',
      image_url: ''
    })
    setSelectedImage(null)
    setImagePreview('')
    setIsDragOver(false)
    setUploadingImage(false)
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
              {/* Program Image */}
              {program.image_url ? (
                <div className="h-48 bg-gray-200">
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
                          <div class="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Target className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Image
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
                        alt="Program preview"
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
