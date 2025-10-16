'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Target, Heart, Award } from 'lucide-react'

function DonationCard() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  
  const presetAmounts = [10, 50, 100]
  
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomAmount(value)
    setSelectedAmount(null)
  }
  
  const handleDonateClick = () => {
    // Validate that an amount is selected before proceeding
    const amount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0)
    if (!amount || amount <= 0) {
      alert('Please select or enter a valid donation amount.')
      return
    }
    setShowEmailForm(true)
  }
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!donorEmail) {
      alert('Please enter your email address.')
      return
    }
    
    const amount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0)
    if (!amount || amount <= 0) {
      alert('Please select or enter a valid donation amount.')
      return
    }
    
    setIsProcessing(true)
    
    try {
      // Generate unique reference for this donation
      const reference = `BOA_ME_DONATION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create donation in Supabase
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donor_name: 'Anonymous',
          donor_email: donorEmail,
          donor_message: '',
          amount: amount,
          payment_reference: reference,
          is_anonymous: true
        })
      })
      
      if (!donationResponse.ok) {
        const errorData = await donationResponse.json()
        throw new Error(errorData.error || 'Failed to create donation')
      }
      
      // Initialize Paystack payment for donation
      const paymentData = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to kobo
          email: donorEmail,
          reference,
          callback_url: `${window.location.origin}/payment/callback`
        })
      }).then(res => res.json())
      
      if (paymentData.status && paymentData.data.authorization_url) {
        // Store donation details in localStorage for callback
        localStorage.setItem('donation_details', JSON.stringify({
          amount,
          donorEmail,
          reference
        }))
        
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url
      } else {
        throw new Error(paymentData.message || 'Payment initialization failed')
      }
    } catch (error) {
      alert('Donation failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // If email form is shown, display the email input form
  if (showEmailForm) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-green-700">Support Our Cause</h3>
        <p className="text-gray-600 mt-2">Help us empower more youth in Ghana</p>
        
        <form onSubmit={handlePayment} className="space-y-4 mt-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-medium text-green-800">
              Amount: GH₵ {selectedAmount || customAmount || '0'}
            </p>
          </div>
          
          <div>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full py-3 px-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 py-3 px-4 rounded font-medium text-white transition-colors ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
        
        {/* Bank Account Information */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-left">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Bank Transfer Details</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p><span className="font-medium bold">Guarantee Trust Bank</span></p>
            <p>Bank Code: <span className="font-medium">230117</span></p>
            <p>Swift Code: <span className="font-medium">GTBIGHAC</span></p>
            <p>Account Number: <span className="font-medium">3217001000046</span></p>
            <p>Account Name: <span className="font-medium">Boame Youth Empowerment</span></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-green-700">Support Our Cause</h3>
      <p className="text-gray-600 mt-2">Help us empower more youth in Ghana</p>
      
      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-3 gap-3">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`py-3 rounded font-bold transition-colors ${
                selectedAmount === amount
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              GH₵ {amount}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input
            type="number"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="GHC Custom amount"
            className="w-full py-3 px-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      
      <button
        onClick={handleDonateClick}
        className="block w-full mt-6 py-3 px-4 rounded text-center transition-colors duration-300 shadow-md font-bold bg-green-600 hover:bg-green-700 text-white"
      >
        Donate Now
      </button>
      
      {/* Bank Account Information */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-left">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Bank Transfer Details</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p><span className="font-medium bold">Guarantee Trust Bank</span></p>
          <p>Bank Code: <span className="font-medium">230117</span></p>
          <p>Swift Code: <span className="font-medium">GTBIGHAC</span></p>
          <p>Account Number: <span className="font-medium">3217001000046</span></p>
          <p>Account Name: <span className="font-medium">Boame Youth Empowerment</span></p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const stats = [
    { number: '500+', label: 'Youth Empowered', icon: Users },
    { number: '15+', label: 'Communities Served', icon: Target },
    { number: '50+', label: 'Volunteers', icon: Heart },
    { number: '5+', label: 'Years of Impact', icon: Award },
  ]

  const features = [
    {
      title: 'Education Support',
      description: 'Providing scholarships, school supplies, and educational resources to underprivileged youth.',
      icon: '📚',
    },
    {
      title: 'Skills Training',
      description: 'Vocational training programs in technology, agriculture, and entrepreneurship.',
      icon: '🛠️',
    },
    {
      title: 'Community Development',
      description: 'Building sustainable communities through youth-led initiatives and projects.',
      icon: '🏘️',
    },
    {
      title: 'Health & Wellness',
      description: 'Promoting physical and mental health awareness among young people.',
      icon: '💚',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/group.jpg')`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/70 to-green-700/80"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-white/30 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left lg:max-w-2xl">
              {/* Main Heading with Enhanced Typography */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white leading-tight">
                <span className="block bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                  Empowering The Youth!
                </span>
              </h1>
              
              {/* Subtitle with Enhanced Styling */}
              <p className="text-lg mb-16 text-green-100 leading-relaxed font-light">
                Join us in creating opportunities for young people in Ghana.<br>
                </br> Together, we can build a brighter future for the next generation.<br></br><br></br>
                We believe that every young person deserves the opportunity to <br></br> 
                reach their full potential, regardless of their background or circumstances
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                <Link
                  href="/donate"
                  className="group bg-white text-green-600 hover:bg-green-50 px-10 py-4 rounded-[10px] font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center shadow-lg"
                >
                  <span className="mr-2">Donate Now</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/programs"
                  className="group border-3 border-white text-white hover:bg-white hover:text-green-600 px-10 py-4 rounded-[10px] font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center backdrop-blur-sm bg-white/10"
                >
                  <span className="mr-2">View Programs</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Small Donation Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-sm">
              <DonationCard />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Boa Me Youth Empowerment is dedicated to transforming the lives of young people 
              in Ghana through education, skills development, and community engagement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Empowering the Next Generation
              </h3>
              <p className="text-gray-600 mb-6">
                We believe that every young person deserves the opportunity to reach their full potential. 
                Through our comprehensive programs, we provide the tools, resources, and support needed 
                for youth to succeed in life.
              </p>
              <p className="text-gray-600 mb-6">
                Our approach focuses on holistic development, addressing not just educational needs, 
                but also life skills, mental health, and community involvement.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-green-100 p-8 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h4>
              <p className="text-gray-700 mb-4">
                To create a Ghana where every young person has access to quality education, 
                meaningful employment, and the opportunity to contribute positively to their community.
              </p>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Our Goals</h4>
              <ul className="text-gray-700 space-y-2">
                <li>• Provide educational support to 1000+ youth annually</li>
                <li>• Establish 20+ skills training centers</li>
                <li>• Create 500+ job opportunities</li>
                <li>• Build 10+ community development projects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive programs address the diverse needs of young people 
              and create lasting positive change in communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your support helps us continue our mission of empowering youth and building 
            stronger communities in Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Make a Donation
            </Link>
            <Link
              href="/programs"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Our Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}