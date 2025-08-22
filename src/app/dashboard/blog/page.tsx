'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, FileText, Calendar, User, Tag, Upload, X } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  featured_image?: string
  created_at: string
  updated_at: string
  published_at?: string
}

export default function BlogPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft' as const,
    featured_image: ''
  })

  useEffect(() => {
    const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      router.push('/dashboard/user')
      return
    }

    fetchBlogPosts()
  }, [user, router])

  const fetchBlogPosts = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockBlogPosts = [
        {
          id: "1",
          title: "Empowering Youth Through Technology",
          content: "Technology has become an essential part of our daily lives, and it's crucial that young people have access to the skills and knowledge they need to thrive in the digital age. Our technology programs focus on teaching coding, digital design, and digital marketing skills that are in high demand in today's job market...",
          excerpt: "Discover how our technology programs are helping young people develop essential digital skills for the modern workforce.",
          author: "Admin User",
          category: "Technology",
          tags: ["technology", "youth", "skills", "digital"],
          status: "published" as const,
          featured_image: "/images/tech-youth.jpg",
          created_at: "2025-08-21T10:00:00Z",
          updated_at: "2025-08-21T10:00:00Z",
          published_at: "2025-08-21T10:00:00Z"
        },
        {
          id: "2",
          title: "The Impact of Leadership Training on Community Development",
          content: "Leadership is not just about leading others; it's about inspiring positive change in our communities. Our leadership training programs equip young people with the skills, confidence, and vision they need to become effective community leaders...",
          excerpt: "Learn about the transformative impact of our leadership training programs on community development.",
          author: "Admin User",
          category: "Leadership",
          tags: ["leadership", "community", "development", "training"],
          status: "published" as const,
          featured_image: "/images/leadership.jpg",
          created_at: "2025-08-20T10:00:00Z",
          updated_at: "2025-08-20T10:00:00Z",
          published_at: "2025-08-20T10:00:00Z"
        },
        {
          id: "3",
          title: "Supporting Young Entrepreneurs in Ghana",
          content: "Entrepreneurship is a powerful driver of economic growth and job creation. Our entrepreneurship programs provide young people with the knowledge, skills, and resources they need to start and grow successful businesses...",
          excerpt: "Explore how we're supporting the next generation of entrepreneurs in Ghana.",
          author: "Admin User",
          category: "Business",
          tags: ["entrepreneurship", "business", "ghana", "startups"],
          status: "draft" as const,
          featured_image: "/images/entrepreneurs.jpg",
          created_at: "2025-08-19T10:00:00Z",
          updated_at: "2025-08-19T10:00:00Z"
        }
      ]
      
      setBlogPosts(mockBlogPosts)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)

    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      // In a real application, you would upload the file to your server/cloud storage here
      // For now, we'll simulate the upload and use a placeholder URL
      setTimeout(() => {
        const uploadedUrl = `/uploads/${Date.now()}_${file.name}`
        setFormData(prev => ({
          ...prev,
          featured_image: uploadedUrl
        }))
        setUploadingImage(false)
      }, 1000)

    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData(prev => ({
      ...prev,
      featured_image: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      
      if (editingPost) {
        // Update existing post
        const updatedPosts = blogPosts.map(post =>
          post.id === editingPost.id
            ? { 
                ...post, 
                ...formData, 
                tags,
                updated_at: new Date().toISOString(),
                published_at: formData.status === 'published' ? new Date().toISOString() : undefined
              }
            : post
        )
        setBlogPosts(updatedPosts)
        alert('Blog post updated successfully!')
      } else {
        // Create new post
        const newPost: BlogPost = {
          id: Date.now().toString(),
          ...formData,
          tags,
          author: user?.name || 'Admin User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: formData.status === 'published' ? new Date().toISOString() : undefined
        }
        setBlogPosts(prev => [newPost, ...prev])
        alert('Blog post created successfully!')
      }
      
      setShowCreateModal(false)
      setEditingPost(null)
      resetForm()
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Error saving blog post. Please try again.')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(', '),
      status: post.status,
      featured_image: post.featured_image || ''
    })
    setImagePreview(post.featured_image || null)
    setShowCreateModal(true)
  }

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogPosts(prev => prev.filter(post => post.id !== postId))
      alert('Blog post deleted successfully!')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      status: 'draft',
      featured_image: ''
    })
    setImagePreview(null)
  }

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts for your audience</p>
        </div>
        <button
          onClick={() => {
            setEditingPost(null)
            resetForm()
            setShowCreateModal(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogPosts.filter(p => p.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogPosts.filter(p => p.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Tag className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(blogPosts.map(p => p.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Blog Posts Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading blog posts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.featured_image && (
                <div className="h-48 bg-gray-200">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : post.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>{post.category}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Edit Post"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Delete Post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-2 text-gray-600">No blog posts found</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingPost(null)
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
                    Post Title *
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
                    <option value="Technology">Technology</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Community">Community</option>
                    <option value="Youth">Youth</option>
                    <option value="News">News</option>
                  </select>
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
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {uploadingImage ? 'Uploading...' : 'Upload a featured image'}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      <label className="cursor-pointer">
                        <span className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
                          Choose File
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                )}
                
                {uploadingImage && (
                  <div className="mt-2 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-1">Uploading image...</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief summary of the blog post..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="tag1, tag2, tag3 (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Write your blog post content here..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingPost(null)
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
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
