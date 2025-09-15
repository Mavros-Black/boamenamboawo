'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
// import CartSidebar from './CartSidebar'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Programs', href: '/programs' },
    // { name: 'Shop', href: '/shop' }, // Temporarily disabled
    { name: 'Blog', href: '/blog' },
    { name: 'Donate', href: '/donate' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="fixed top-4 w-full z-50 transition-all duration-300">
      {/* Mobile version - full width */}
      <div className="md:hidden">
        <div className={`h-16 flex items-center transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <div className="w-full flex justify-between items-center px-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img 
                  src="/logo.svg" 
                  alt="Boame Logo" 
                  className="h-12 w-auto drop-shadow-sm"
                />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-800 hover:text-green-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop version - 80% width and centered */}
      <div className="hidden md:block">
        <div className="w-[80%] mx-auto">
          <div className={`h-16 flex items-center transition-all duration-300 rounded-[10px] ${
            scrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-white/80 backdrop-blur-sm'
          }`}>
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <img 
                    src="/logo.svg" 
                    alt="Boame Logo" 
                    className="h-12 w-auto drop-shadow-sm"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:text-green-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4">            
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-800 hover:text-green-600 transition-colors"
                    >
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsUserDropdownOpen(false)}
                        ></div>
                        
                        {/* Dropdown Content */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border">
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout()
                              setIsUserDropdownOpen(false)
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-2 inline" />
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:text-green-600 transition-colors"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/donate"
                      className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg mt-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link
                  href="/auth/login"
                  className="text-gray-800 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/donate"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-base font-medium block text-center mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Cart Sidebar - Hidden for now */}
      {/* <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
    </nav>
  )
}

export default Navbar