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
      // Mock data for now - replace with actual API call
      const mockBlogPosts = [
        {
          id: "1",
          title: "Empowering Youth Through Technology",
          content: "Technology has become an essential part of our daily lives, and it's crucial that young people have access to the skills and knowledge they need to thrive in the digital age. Our technology programs focus on teaching coding, digital design, and digital marketing skills that are in high demand in today's job market. Through hands-on workshops, mentorship programs, and real-world projects, we're helping young people develop the technical skills they need to succeed in the modern workforce. Our approach combines theoretical knowledge with practical application, ensuring that participants not only learn the concepts but also gain valuable experience working on actual projects. We believe that technology education should be accessible to everyone, regardless of their background or circumstances. That's why we offer our programs free of charge and provide all necessary equipment and resources. Our goal is to bridge the digital divide and create opportunities for young people to build successful careers in technology.",
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
          content: "Leadership is not just about leading others; it's about inspiring positive change in our communities. Our leadership training programs equip young people with the skills, confidence, and vision they need to become effective community leaders. We focus on developing essential leadership qualities such as communication, problem-solving, decision-making, and emotional intelligence. Through interactive workshops, group activities, and real-world challenges, participants learn how to motivate others, build strong teams, and create lasting positive impact in their communities. Our programs also emphasize the importance of ethical leadership and social responsibility, ensuring that our future leaders are committed to making a difference in the world. We believe that everyone has the potential to be a leader, and our goal is to help young people discover and develop their leadership abilities. By investing in youth leadership development, we're investing in the future of our communities and our country.",
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
          content: "Entrepreneurship is a powerful driver of economic growth and job creation. Our entrepreneurship programs provide young people with the knowledge, skills, and resources they need to start and grow successful businesses. We cover all aspects of entrepreneurship, from ideation and business planning to marketing, finance, and operations. Our programs include mentorship from successful entrepreneurs, access to funding opportunities, and networking events that connect young entrepreneurs with potential investors and partners. We also provide practical support such as business registration assistance, legal advice, and access to co-working spaces. Our goal is to create a thriving ecosystem of young entrepreneurs who can contribute to Ghana's economic development and create jobs for others. We believe that entrepreneurship is one of the most effective ways to address youth unemployment and create sustainable economic growth. By supporting young entrepreneurs, we're building a stronger, more prosperous future for Ghana.",
          excerpt: "Explore how we're supporting the next generation of entrepreneurs in Ghana.",
          author: "Admin User",
          category: "Business",
          tags: ["entrepreneurship", "business", "ghana", "startups"],
          status: "published" as const,
          featured_image: "/images/entrepreneurs.jpg",
          created_at: "2025-08-19T10:00:00Z",
          updated_at: "2025-08-19T10:00:00Z",
          published_at: "2025-08-19T10:00:00Z"
        }
      ]
      
      // Only show published posts
      const publishedPosts = mockBlogPosts.filter(post => post.status === 'published')
      setBlogPosts(publishedPosts)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
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

