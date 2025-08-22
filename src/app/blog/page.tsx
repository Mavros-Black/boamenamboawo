'use client'

import { useState, useEffect } from 'react'
import { Calendar, User, Tag, Search, ArrowRight } from 'lucide-react'

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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      
      const { blogPosts: apiBlogPosts } = await response.json()
      
      // Transform API data to match our interface
      const transformedPosts: BlogPost[] = (apiBlogPosts || []).map((post: any) => {
        console.log('Processing blog post:', post)
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          author: post.author || 'Admin User',
          category: post.category || 'General',
          tags: post.tags || [],
          status: post.status,
          featured_image: post.image_url || '',
          created_at: post.created_at,
          updated_at: post.updated_at,
          published_at: post.published_at
        }
      })
      
      // Show all posts for now (including drafts for testing)
      console.log('All transformed posts:', transformedPosts)
      setBlogPosts(transformedPosts)
      
      // Uncomment this line to only show published posts:
      // const publishedPosts = transformedPosts.filter(post => post.status === 'published')
      // setBlogPosts(publishedPosts)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      // Fallback to empty array
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest news, insights, and stories from our youth empowerment programs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        ) : (
          <>
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200">
                      {post.featured_image ? (
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', post.featured_image)
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const placeholder = document.createElement('div')
                            placeholder.className = 'w-full h-full flex items-center justify-center text-gray-600'
                            placeholder.innerHTML = `
                              <div class="text-center">
                                <div class="text-4xl mb-2">📷</div>
                                <div class="text-sm">Image not available</div>
                              </div>
                            `
                            target.parentNode?.appendChild(placeholder)
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', post.featured_image)
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📷</div>
                            <div className="text-sm">No Image</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {post.category}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                      
                      {post.tags.length > 0 && (
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
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== '' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Check back soon for new blog posts!'
                  }
                </p>
              </div>
            )}
          </>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter to receive the latest blog posts and updates about our programs.
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

