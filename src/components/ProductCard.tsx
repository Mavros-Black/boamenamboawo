'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  featured: boolean
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAdded, setShowAdded] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = () => {
    addToCart(product)
    setShowAdded(true)
    setTimeout(() => setShowAdded(false), 2000)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        <ShoppingCart className="h-16 w-16 text-gray-400" />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-sm text-gray-500 mb-2">{product.category}</div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center mb-4">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button - available for all users */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || showAdded}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            showAdded
              ? 'bg-green-500 text-white cursor-not-allowed'
              : product.inStock
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {showAdded ? (
            <div className="flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Added to Cart!
            </div>
          ) : product.inStock ? (
            <div className="flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </div>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </div>
  )
}
