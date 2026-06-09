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
      alt: 'Youth empowerment activities',
      category: 'community',
      title: 'Taifa Community Project',
      description: 'Youth actively participating in community development and cleanup initiatives in Taifa.'
    },
    {
      id: 2,
      src: '/images/gallery/2.jpg',
      alt: 'Skills training workshop',
      category: 'programs',
      title: 'Chorkor Skills Center',
      description: 'Hands-on vocational training session building practical skills for youth in Chorkor.'
    },
    {
      id: 3,
      src: '/images/gallery/3.jpg',
      alt: 'Educational program session',
      category: 'programs',
      title: 'Jamestown Educational Workshop',
      description: 'Interactive learning environment fostering knowledge, literacy, and growth in Jamestown.'
    },
    {
      id: 4,
      src: '/images/gallery/4.jpg',
      alt: 'Community celebration event',
      category: 'events',
      title: 'Madina Community Celebration',
      description: 'Celebrating local milestones and youth achievements with the Madina community.'
    },
    {
      id: 5,
      src: '/images/gallery/5.jpg',
      alt: 'Youth leadership training',
      category: 'programs',
      title: 'Tema Leadership Academy',
      description: 'Empowering young leaders in Tema to drive positive social change.'
    },
    {
      id: 6,
      src: '/images/gallery/6.jpg',
      alt: 'Community outreach activity',
      category: 'community',
      title: 'Kumasi Community Outreach',
      description: 'Extending our outreach programs to support communities and young farmers in Kumasi.'
    },
    {
      id: 7,
      src: '/images/gallery/7.jpg',
      alt: 'Graduation ceremony',
      category: 'events',
      title: 'Cape Coast Program Graduation',
      description: 'Celebrating the success of Cape Coast vocational program participants and graduates.'
    },
    {
      id: 8,
      src: '/images/gallery/8.jpg',
      alt: 'Vocational training session',
      category: 'programs',
      title: 'Koforidua Vocational Workshop',
      description: 'Practical skills training preparing youth for meaningful employment in Koforidua.'
    },
    {
      id: 9,
      src: '/images/gallery/9.jpg',
      alt: 'Youth empowerment gathering',
      category: 'community',
      title: 'Tamale Youth Gathering',
      description: 'Young people in Tamale coming together to share experiences and build networks.'
    },
    {
      id: 10,
      src: '/images/gallery/10.jpg',
      alt: 'Special recognition event',
      category: 'events',
      title: 'Ho Recognition Ceremony',
      description: 'Honoring outstanding youth achievements and community contributions in Ho.'
    },
    {
      id: 11,
      src: '/images/gallery/11.jpg',
      alt: 'Entrepreneurship workshop',
      category: 'programs',
      title: 'Ashaiman Entrepreneurship Boot Camp',
      description: 'Teaching business skills and fostering entrepreneurial spirit in Ashaiman.'
    },
    {
      id: 12,
      src: '/images/gallery/12.jpg',
      alt: 'Community development project',
      category: 'community',
      title: 'Nima Infrastructure Project',
      description: 'Collaborative youth-led efforts to improve local community infrastructure in Nima.'
    },
    {
      id: 13,
      src: '/images/gallery/13.jpg',
      alt: 'Annual conference event',
      category: 'events',
      title: 'Osu Annual Planning Conference',
      description: 'Bringing together key stakeholders in Osu to design future youth initiatives.'
    },
    {
      id: 14,
      src: '/images/gallery/14.jpg',
      alt: 'Technology skills training',
      category: 'programs',
      title: 'Labadi Beach Conservation Hub',
      description: 'Preparing youth for environmental leadership and ocean conservation at Labadi.'
    },
    {
      id: 15,
      src: '/images/gallery/15.jpg',
      alt: 'Community volunteer activity',
      category: 'community',
      title: 'Dansoman Youth Initiative',
      description: 'Youth volunteers making a positive impact on digital literacy in Dansoman.'
    },
    {
      id: 16,
      src: '/images/gallery/16.jpg',
      alt: 'STEM workshop demonstration',
      category: 'programs',
      title: 'Spintex Tech & Innovation Lab',
      description: 'Introducing young people to programming and electronics at our Spintex hub.'
    },
    {
      id: 17,
      src: '/images/gallery/17.jpg',
      alt: 'Community clean-up activity',
      category: 'community',
      title: 'Legon Environmental Campaign',
      description: 'Students and local youth working together for clean-up and sanitation campaigns near Legon.'
    },
    {
      id: 18,
      src: '/images/gallery/18.jpg',
      alt: 'Award presentation on stage',
      category: 'events',
      title: 'Dome Youth Gala Night',
      description: 'Celebrating achievements during the annual youth awards ceremony in Dome.'
    },
    {
      id: 19,
      src: '/images/gallery/19.jpg',
      alt: 'Agriculture training session',
      category: 'programs',
      title: 'Achimota Sustainable Farm',
      description: 'Teaching modern agricultural techniques and smart farming practices in Achimota.'
    },
    {
      id: 20,
      src: '/images/gallery/20.jpg',
      alt: 'Community health outreach',
      category: 'community',
      title: 'Gbawe Health Outreach Drive',
      description: 'Providing vital health education and basic medical screenings to families in Gbawe.'
    },
    {
      id: 21,
      src: '/images/gallery/21.jpg',
      alt: 'Mentorship circle discussion',
      category: 'programs',
      title: 'Kwabenya Mentorship Circle',
      description: 'Experienced professionals guiding local youth through career development goals in Kwabenya.'
    },
    {
      id: 22,
      src: '/images/gallery/22.jpg',
      alt: 'Cultural festival performance',
      category: 'events',
      title: 'Adenta Cultural Celebration',
      description: 'Showcasing traditional Ghanaian arts and music at our Adenta community event.'
    },
    {
      id: 23,
      src: '/images/gallery/23.jpg',
      alt: 'Community garden project',
      category: 'community',
      title: 'Tesano Urban Garden Project',
      description: 'Transforming vacant city spaces in Tesano into productive vegetable gardens.'
    },
    {
      id: 24,
      src: '/images/gallery/24.jpg',
      alt: 'Coding bootcamp session',
      category: 'programs',
      title: 'Cantonments Coding Bootcamp',
      description: 'Equipping youth in Accra with advanced web development skills for the future.'
    },
    {
      id: 25,
      src: '/images/gallery/25.jpg',
      alt: 'Networking reception at event',
      category: 'events',
      title: 'Kasoa Networking Hub',
      description: 'Connecting young change-makers and business partners during a networking event in Kasoa.'
    },
    {
      id: 26,
      src: '/images/gallery/26.jpg',
      alt: 'Neighborhood outreach visit',
      category: 'community',
      title: 'Sakumono Neighborhood Visit',
      description: 'Meeting families in Sakumono to share vocational scholarship and training opportunities.'
    },
    {
      id: 27,
      src: '/images/gallery/27.jpg',
      alt: 'Business pitch coaching',
      category: 'programs',
      title: 'Teshie Business Coaching Hub',
      description: 'Preparing local startup founders in Teshie to pitch their projects to investors.'
    },
    {
      id: 28,
      src: '/images/gallery/28.jpg',
      alt: 'Outdoor community concert',
      category: 'events',
      title: 'Korle Gonno Youth Concert',
      description: 'Uniting local youth and families through music and creative arts in Korle Gonno.'
    },
    {
      id: 29,
      src: '/images/gallery/29.jpg',
      alt: 'Art therapy workshop',
      category: 'programs',
      title: 'Lapaz Creative Expression Workshop',
      description: 'Using visual arts to build self-confidence and mental wellbeing among Lapaz youth.'
    },
    {
      id: 30,
      src: '/images/gallery/30.jpg',
      alt: 'Community sports day',
      category: 'community',
      title: 'East Legon Athletic Club',
      description: 'Fostering teamwork, discipline, and healthy living through community sports in East Legon.'
    },
    {
      id: 31,
      src: '/images/gallery/31.jpg',
      alt: 'Panel discussion at conference',
      category: 'events',
      title: 'Accra Youth Leadership Summit',
      description: 'National and regional stakeholders discussing the future of youth empowerment in Ghana.'
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 pt-20">Photo Gallery</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Capturing moments of empowerment, growth, and community impact. 
            Explore {galleryImages.length} powerful images showcasing our youth development programs across Ghana.
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
