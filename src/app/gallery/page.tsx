'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Camera, Users, Award } from 'lucide-react'
import Image from 'next/image'

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Gallery categories
  const categories = [
    { id: 'all', name: 'All Photos', icon: Camera },
    { id: 'programs', name: 'Programs', icon: Users },
    { id: 'events', name: 'Events', icon: Award },
    { id: 'community', name: 'Community', icon: Users }
  ]

  // Gallery images from actual photos
  const galleryImages = [
    {
      id: 1,
      src: '/images/gallery/1.jpg',
      alt: 'Youth empowerment activities in Taifa',
      category: 'community',
      title: 'Outreach & Engagement',
      description: 'Local youth and volunteers gathered at the Taifa project center to kick off the community outreach initiative.'
    },
    {
      id: 2,
      src: '/images/gallery/2.jpg',
      alt: 'Skills training workshop in Taifa',
      category: 'programs',
      title: 'Vocational Training',
      description: 'Hands-on training session for young people developing practical vocational skills at our Taifa center.'
    },
    {
      id: 3,
      src: '/images/gallery/3.jpg',
      alt: 'Educational program session in Taifa',
      category: 'programs',
      title: 'Literacy Workshop',
      description: 'Interactive educational class focused on improving literacy and life skills for kids in Taifa.'
    },
    {
      id: 4,
      src: '/images/gallery/4.jpg',
      alt: 'Community celebration event in Taifa',
      category: 'events',
      title: 'Launch Celebration',
      description: 'Celebrating the official launch of the youth empowerment initiative with the Taifa community.'
    },
    {
      id: 5,
      src: '/images/gallery/5.jpg',
      alt: 'Youth leadership training in Taifa',
      category: 'programs',
      title: 'Leadership Academy',
      description: 'Empowering selected young leaders from Taifa to spearhead future community development.'
    },
    {
      id: 6,
      src: '/images/gallery/6.jpg',
      alt: 'Community outreach activity in Taifa',
      category: 'community',
      title: 'Neighborhood Mobilization',
      description: 'Working alongside Taifa local leaders to register participants for the upcoming training cohorts.'
    },
    {
      id: 7,
      src: '/images/gallery/7.jpg',
      alt: 'Graduation ceremony in Taifa',
      category: 'events',
      title: 'First Cohort Graduation',
      description: 'Celebrating the hard work and graduation of our first batch of vocational students in Taifa.'
    },
    {
      id: 8,
      src: '/images/gallery/8.jpg',
      alt: 'Vocational training session in Taifa',
      category: 'programs',
      title: 'Hands-on Craftsmanship',
      description: 'Practical workshop session in Taifa focusing on technical crafts and electrical installation basics.'
    },
    {
      id: 9,
      src: '/images/gallery/9.jpg',
      alt: 'Youth empowerment gathering in Taifa',
      category: 'community',
      title: 'Youth Town Hall',
      description: 'A collaborative meeting where Taifa youth discussed challenges and proposed local solutions.'
    },
    {
      id: 10,
      src: '/images/gallery/10.jpg',
      alt: 'Special recognition event in Taifa',
      category: 'events',
      title: 'Meritorious Awards',
      description: 'Recognizing outstanding student leaders and volunteers during the Taifa project evaluation ceremony.'
    },
    {
      id: 11,
      src: '/images/gallery/11.jpg',
      alt: 'Entrepreneurship workshop in Taifa',
      category: 'programs',
      title: 'Entrepreneurship Boot Camp',
      description: 'Instructing young Taifa entrepreneurs on financial literacy, budgeting, and startup management.'
    },
    {
      id: 12,
      src: '/images/gallery/12.jpg',
      alt: 'Community development project in Taifa',
      category: 'community',
      title: 'Sanitation Infrastructure',
      description: 'Collaborative effort by local youth to install waste management bins across the Taifa neighborhood.'
    },
    {
      id: 13,
      src: '/images/gallery/13.jpg',
      alt: 'Annual conference event in Taifa',
      category: 'events',
      title: 'Annual Progress Summit',
      description: 'Stakeholders and community members reviewing the social and economic impact of the project in Taifa.'
    },
    {
      id: 14,
      src: '/images/gallery/14.jpg',
      alt: 'Technology skills training in Taifa',
      category: 'programs',
      title: 'Digital Literacy Class',
      description: 'Introducing basic computer skills and internet safety to young students in the Taifa community.'
    },
    {
      id: 15,
      src: '/images/gallery/15.jpg',
      alt: 'Community volunteer activity in Taifa',
      category: 'community',
      title: 'Sanitation Campaign',
      description: 'Youth volunteer mobilization for clean-up exercises around local markets and drains in Taifa.'
    },
    {
      id: 16,
      src: '/images/gallery/16.jpg',
      alt: 'STEM workshop demonstration in Taifa',
      category: 'programs',
      title: 'STEM Science Lab',
      description: 'Exploring practical science and technology applications using lab equipment provided at our Taifa center.'
    },
    {
      id: 17,
      src: '/images/gallery/17.jpg',
      alt: 'Community clean-up activity in Taifa',
      category: 'community',
      title: 'Environmental Awareness',
      description: 'Educating local households in Taifa on plastic recycling and clean environmental habits.'
    },
    {
      id: 18,
      src: '/images/gallery/18.jpg',
      alt: 'Award presentation on stage in Taifa',
      category: 'events',
      title: 'Gala Dinner',
      description: 'A celebratory dinner in Taifa honoring our corporate sponsors, local chiefs, and partner organizations.'
    },
    {
      id: 19,
      src: '/images/gallery/19.jpg',
      alt: 'Agriculture training session in Taifa',
      category: 'programs',
      title: 'Urban Agriculture',
      description: 'Introducing modern backyard farming and organic vegetable cultivation to Taifa youth.'
    },
    {
      id: 20,
      src: '/images/gallery/20.jpg',
      alt: 'Community health outreach in Taifa',
      category: 'community',
      title: 'Health & Screening Drive',
      description: 'Providing free blood pressure checks, health education, and counseling to Taifa families.'
    },
    {
      id: 21,
      src: '/images/gallery/21.jpg',
      alt: 'Mentorship circle discussion in Taifa',
      category: 'programs',
      title: 'Career Mentorship Circle',
      description: 'Professional mentors discussing career pathways and CV writing tips with senior high graduates in Taifa.'
    },
    {
      id: 22,
      src: '/images/gallery/22.jpg',
      alt: 'Cultural festival performance in Taifa',
      category: 'events',
      title: 'Cultural Showcase',
      description: 'Youth displaying traditional drumming and dance performances during our cultural festival day in Taifa.'
    },
    {
      id: 23,
      src: '/images/gallery/23.jpg',
      alt: 'Community garden project in Taifa',
      category: 'community',
      title: 'Community Garden',
      description: 'Setting up green spaces and communal food gardens to promote self-sufficiency in Taifa.'
    },
    {
      id: 24,
      src: '/images/gallery/24.jpg',
      alt: 'Coding bootcamp session in Taifa',
      category: 'programs',
      title: 'Code Training',
      description: 'An intensive introductory course to HTML, CSS, and basic software development logic for Taifa youth.'
    },
    {
      id: 25,
      src: '/images/gallery/25.jpg',
      alt: 'Networking reception at event in Taifa',
      category: 'events',
      title: 'Partners Round-table',
      description: 'Connecting program graduates in Taifa with local employers and internship coordinators.'
    },
    {
      id: 26,
      src: '/images/gallery/26.jpg',
      alt: 'Neighborhood outreach visit in Taifa',
      category: 'community',
      title: 'Home Outreach Visits',
      description: 'Field officers visiting households in Taifa to check on the progress and wellbeing of training participants.'
    },
    {
      id: 27,
      src: '/images/gallery/27.jpg',
      alt: 'Business pitch coaching in Taifa',
      category: 'programs',
      title: 'Pitching Competition',
      description: 'Graduating entrepreneurship students pitching business ideas to a panel of local business leaders in Taifa.'
    },
    {
      id: 28,
      src: '/images/gallery/28.jpg',
      alt: 'Outdoor community concert in Taifa',
      category: 'events',
      title: 'Peace Concert',
      description: 'A massive community gathering in Taifa utilizing music to promote unity and peaceful coexistence among youth.'
    },
    {
      id: 29,
      src: '/images/gallery/29.jpg',
      alt: 'Art therapy workshop in Taifa',
      category: 'programs',
      title: 'Creative Arts Workshop',
      description: 'Providing creative outlets for youth expression through painting, sculpting, and design in Taifa.'
    },
    {
      id: 30,
      src: '/images/gallery/30.jpg',
      alt: 'Community sports day in Taifa',
      category: 'community',
      title: 'Community Sports Gala',
      description: 'Building teamwork, physical fitness, and friendly competition through soccer matches in Taifa.'
    },
    {
      id: 31,
      src: '/images/gallery/31.jpg',
      alt: 'Panel discussion at conference in Taifa',
      category: 'events',
      title: 'Stakeholders Forum',
      description: 'Reflecting on Taifa project milestones and planning for scalability to adjacent communities.'
    }
  ]

  // Filter images based on selected category
  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  const openModal = (imageId: number) => {
    setSelectedImage(imageId)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage)
    let newIndex
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
    }
    
    setSelectedImage(filteredImages[newIndex].id)
  }

  const selectedImageData = selectedImage 
    ? filteredImages.find(img => img.id === selectedImage)
    : null

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 pt-20">Taifa Community Project</h1>
          <p className="text-lg text-green-100 font-medium mb-6 uppercase tracking-wider">Photo Gallery</p>
          <p className="text-xl max-w-3xl mx-auto">
            Capturing moments of empowerment, growth, and community impact. 
            Explore {galleryImages.length} powerful images showcasing our youth development initiatives in Taifa.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{galleryImages.length}</div>
              <div className="text-gray-600">Photos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">8</div>
              <div className="text-gray-600">Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Youth Featured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200 hover:border-green-200'
                }`}
              >
                <category.icon className="h-5 w-5 mr-2" />
                {category.name}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col border border-gray-100"
                onClick={() => openModal(image.id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {image.category}
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wider block mb-1">
                      Taifa Community Project
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {image.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {image.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <span>View full photo</span>
                    <span className="text-green-600 font-semibold group-hover:underline">Click to open &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos found</h3>
              <p className="text-gray-500">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedImage && selectedImageData && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="text-center">
              {selectedImageData && (
                <>
                  <img
                    src={selectedImageData.src}
                    alt={selectedImageData.alt}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                  
                  {/* Image Info */}
                  <div className="text-white mt-4">
                    <span className="text-sm font-semibold text-green-400 uppercase tracking-wider block mb-1">
                      Taifa Community Project
                    </span>
                    <h3 className="text-xl font-semibold mb-2">{selectedImageData.title}</h3>
                    <p className="text-gray-300">{selectedImageData.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Be Part of Our Story
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us in creating more moments of empowerment and positive change 
            in the lives of young people across Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Support Our Mission
            </a>
            <a
              href="/programs"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Join Our Programs
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
