'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Camera, Users, Award } from 'lucide-react'

export default function GalleryPage() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Gallery categories
  const categories = [
    { id: 'all', name: 'All Photos', icon: Camera },
    { id: 'programs', name: 'Programs', icon: Users },
    { id: 'events', name: 'Events', icon: Award },
    { id: 'community', name: 'Community', icon: Users }
  ]

  // Projects list
  const projects = [
    {
      id: 'taifa',
      title: 'Taifa Community Project',
      category: 'community',
      imageCount: 31,
      coverImage: '/images/gallery/1.jpg',
      images: Array.from({ length: 31 }, (_, i) => `/images/gallery/${i + 1}.jpg`)
    },
    {
      id: 'youth-boys-event',
      title: 'Youth Boys Event',
      category: 'events',
      imageCount: 0,
      coverImage: '',
      images: []
    },
    {
      id: 'boy-football-games',
      title: 'boy Football Games',
      category: 'events',
      imageCount: 0,
      coverImage: '',
      images: []
    }
  ]

  // Filter projects in project list view
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

  // Find currently active expanded project
  const currentProject = projects.find(p => p.id === expandedProject)

  // Get project images
  const projectImages = currentProject
    ? Array.from({ length: currentProject.imageCount }, (_, i) => ({
        id: i + 1,
        src: `/images/gallery/${i + 1}.jpg`,
        alt: currentProject.title,
        category: currentProject.category,
        title: currentProject.title
      }))
    : []

  // Filter images inside expanded project view
  const filteredImages = selectedCategory === 'all'
    ? projectImages
    : projectImages.filter(img => img.category === selectedCategory)

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
          <h1 className="text-4xl md:text-5xl font-bold mb-3 pt-20">
            {expandedProject && currentProject ? currentProject.title : 'Photo Gallery'}
          </h1>
          <p className="text-lg text-green-100 font-medium mb-6 uppercase tracking-wider">
            {expandedProject && currentProject ? 'Project Images' : 'Youth Empowerment Initiatives'}
          </p>
          <p className="text-xl max-w-3xl mx-auto">
            {expandedProject && currentProject
              ? `Exploring the impact of the ${currentProject.title} through our visual journey.`
              : 'Capturing moments of empowerment, growth, and community impact across our projects.'}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      {!expandedProject && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">31</div>
                <div className="text-gray-600">Photos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">{projects.length}</div>
                <div className="text-gray-600">Active Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">Youth Featured</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">Ghana</div>
                <div className="text-gray-600">Communities</div>
              </div>
            </div>
          </div>
        </section>
      )}

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

          {expandedProject && currentProject ? (
            /* EXPANDED VIEW: MASONRY GRID OF PROJECT IMAGES */
            <div>
              {/* Back Button and Context info */}
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  onClick={() => setExpandedProject(null)}
                  className="flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors self-start"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back to Projects
                </button>
                <div className="text-gray-500 text-sm font-medium">
                  Showing {filteredImages.length} of {currentProject.imageCount} photos
                </div>
              </div>

              {/* Masonry Grid */}
              {filteredImages.length > 0 && (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className="break-inside-avoid bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 flex flex-col"
                      onClick={() => openModal(image.id)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {image.category}
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-base font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {filteredImages.length === 0 && (
                <div className="text-center py-16">
                  <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Photos coming soon</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    We are currently organizing the photo gallery for this event. Please check back later!
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* PROJECT LIST VIEW: STACKED PHOTO DECKS */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setExpandedProject(project.id)}
                    className="group relative w-full max-w-sm mx-auto h-96 cursor-pointer"
                  >
                    {/* Third photo (bottom of stack) */}
                    <div className="absolute inset-0 bg-white rounded-xl shadow-md border border-gray-100 transform -rotate-3 translate-y-2 translate-x-1 group-hover:-rotate-6 group-hover:translate-y-4 transition-all duration-300 overflow-hidden">
                      {project.images.length >= 3 ? (
                        <img
                          src={project.images[2]}
                          alt=""
                          className="w-full h-full object-cover opacity-60"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-60" />
                      )}
                    </div>
                    {/* Second photo (middle of stack) */}
                    <div className="absolute inset-0 bg-white rounded-xl shadow-md border border-gray-100 transform rotate-2 -translate-y-1 translate-x-2 group-hover:rotate-4 group-hover:-translate-y-2 group-hover:translate-x-4 transition-all duration-300 overflow-hidden">
                      {project.images.length >= 2 ? (
                        <img
                          src={project.images[1]}
                          alt=""
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-80" />
                      )}
                    </div>
                    {/* Top photo (main card) */}
                    <div className="absolute inset-0 bg-white rounded-xl shadow-lg border border-gray-200 transform group-hover:-translate-y-4 transition-all duration-300 overflow-hidden flex flex-col">
                      <div className="relative h-72 w-full overflow-hidden bg-gray-50 flex-shrink-0">
                        {project.images.length > 0 ? (
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-500/10 to-emerald-600/20 flex flex-col items-center justify-center p-6 text-green-700">
                            <Camera className="h-12 w-12 mb-2 opacity-50" />
                            <span className="text-xs font-bold uppercase tracking-wider text-green-600">No Photos Yet</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {project.category}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                          {project.imageCount} Photos
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex items-center justify-center text-center">
                        <h3 className="text-lg font-bold text-gray-950 group-hover:text-green-600 transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
                  <p className="text-gray-500">Try selecting a different category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modal Lightbox */}
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
                    <h3 className="text-lg font-medium">{selectedImageData.title}</h3>
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
