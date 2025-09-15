'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Filter, Search } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import CartSidebar from '@/components/CartSidebar'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

// Helper function to get placeholder image if database image is missing
const getPlaceholderImage = (productId: string): string => {
  return `https://picsum.photos/400/300?random=${productId}&blur=2`
}

export default function ShopPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { cartCount } = useCart()
  const { user } = useAuth()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        
                        // Transform API data to match the expected format
        const transformedProducts = data.products.map((product: any) => ({
          id: product.id, // Keep as string (UUID)
          name: product.name,
          description: product.description || '',
          price: parseFloat(product.price),
          originalPrice: parseFloat(product.price) * 1.2, // 20% markup for display
          image: product.image_url || getPlaceholderImage(product.id),
          category: product.category || 'General',
          rating: 4.5, // Default rating
          reviews: Math.floor(Math.random() * 50) + 5, // Random reviews
          inStock: product.in_stock,
          featured: false, // Default to false
        }))
        
        setProducts(transformedProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = ['All', 'Clothing', 'Books', 'Accessories']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Boa Me Shop</h1>
          <p className="text-xl max-w-3xl mx-auto mb-4">
            Support our mission while getting quality products. Every purchase helps fund 
            our youth empowerment programs in Ghana.
          </p>
          {!user && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm">
                💡 <strong>Guest Shopping:</strong> You can add items to your cart without an account. 
                Login will be required only at checkout to complete your purchase.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Temporary Shop Disabled Notice */}
      <section className="py-12 bg-yellow-50 border-t border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <ShoppingCart className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop Temporarily Unavailable</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Our shop is currently undergoing updates to serve you better. 
              We apologize for any inconvenience and appreciate your patience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Support Our Mission
              </Link>
              <Link
                href="/programs"
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
                View Our Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Commented out temporarily */}
      {/*

      {/* Shop Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Search and Cart */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-80"
                />
              </div>
            </div>
            
                         <div className="flex items-center space-x-4">
               {cartCount > 0 && (
                 <Link
                   href="/checkout"
                   className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                 >
                   <ShoppingCart className="h-5 w-5" />
                   <span>Checkout ({cartCount})</span>
                 </Link>
               )}
               <button
                 onClick={() => setIsCartOpen(true)}
                 className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors relative"
               >
                 <ShoppingCart className="h-5 w-5" />
                 <span>Cart ({cartCount})</span>
               </button>
             </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-4 mb-8">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-gray-600 font-medium">Filter by:</span>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          {selectedCategory === 'All' && searchTerm === '' && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.featured).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* All Products */}
          {!loading && !error && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'All Products'}
              </h2>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

             {/* Cart Sidebar - show for all users
       <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
       */}

      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Purchase Makes a Difference</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                         Every purchase from our shop directly supports our youth empowerment programs. 
             You&apos;re not just buying products - you&apos;re investing in the future of Ghana&apos;s youth.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Education Support</h3>
              <p className="text-gray-600">Funds scholarships and educational resources</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Skills Training</h3>
              <p className="text-gray-600">Supports vocational and technical training programs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Projects</h3>
              <p className="text-gray-600">Helps build sustainable community initiatives</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
