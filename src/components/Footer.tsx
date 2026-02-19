'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.')
      return
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to subscribe')
      }

      alert('Successfully subscribed to our newsletter!')
      setEmail('')
    } catch (error) {
      console.error('Newsletter subscription failed:', error)
      alert('Failed to subscribe. Please try again.')
    }
  }

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Programs', href: '/programs' },
    { name: 'Constitution', href: '/constitution' },
    { name: 'Donate', href: '/donate' },
    { name: 'Contact', href: '/contact' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/asset.png"
                alt="Boa Me Logo"
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold">Boa Me</span>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering Youth, Building Futures. Join us in creating opportunities 
              for young people in Ghana.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-400 mr-3" />
                <span className="text-gray-300">boamenameboawo@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-400 mr-3" />
                <span className="text-gray-300">+233 24 529 0748</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-green-400 mr-3 mt-1" />
                <span className="text-gray-300">
                  Accra, Ghana<br />
                  West Africa
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Stay updated with our latest news and events.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Boa Me Youth Empowerment. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Registered NGO in Ghana | Tax ID: XXXXXXXX | Designed with <Heart className="inline-block h-4 w-4 text-red-500"/> by <a href="https://mavrosblack.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300"> Mavros Black Team</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
