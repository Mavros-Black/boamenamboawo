import Link from 'next/link'
import { Calendar, Users, MapPin, Target, Heart } from 'lucide-react'

export default function ProgramsPage() {
  const programs = [
    {
      id: 1,
      title: 'Digital Skills Training',
      description: 'Comprehensive training in computer literacy, coding, and digital marketing for youth aged 16-25.',
      image: '/api/placeholder/400/300',
      status: 'ongoing',
      participants: 120,
      location: 'Accra, Ghana',
      duration: '6 months',
      category: 'Technology',
      impact: '85% employment rate',
      supportNeeded: true,
    },
    {
      id: 2,
      title: 'Youth Entrepreneurship Program',
      description: 'Supporting young entrepreneurs with business skills, mentorship, and seed funding.',
      image: '/api/placeholder/400/300',
      status: 'ongoing',
      participants: 80,
      location: 'Kumasi, Ghana',
      duration: '12 months',
      category: 'Business',
      impact: '30 businesses launched',
      supportNeeded: true,
    },
    {
      id: 3,
      title: 'Agricultural Innovation Hub',
      description: 'Modern farming techniques and sustainable agriculture practices for rural youth.',
      image: '/api/placeholder/400/300',
      status: 'ongoing',
      participants: 150,
      location: 'Tamale, Ghana',
      duration: '8 months',
      category: 'Agriculture',
      impact: 'Increased crop yields by 40%',
      supportNeeded: true,
    },
    {
      id: 4,
      title: 'Girls in STEM Initiative',
      description: 'Encouraging girls to pursue careers in Science, Technology, Engineering, and Mathematics.',
      image: '/api/placeholder/400/300',
      status: 'ongoing',
      participants: 60,
      location: 'Accra, Ghana',
      duration: '10 months',
      category: 'Education',
      impact: '90% continued to higher education',
      supportNeeded: true,
    },
    {
      id: 5,
      title: 'Community Health Awareness',
      description: 'Health education and wellness programs focusing on mental health and physical fitness.',
      image: '/api/placeholder/400/300',
      status: 'completed',
      participants: 200,
      location: 'Multiple locations',
      duration: '4 months',
      category: 'Health',
      impact: 'Improved health awareness in 5 communities',
      supportNeeded: false,
    },
    {
      id: 6,
      title: 'Creative Arts Workshop',
      description: 'Nurturing artistic talents through music, dance, visual arts, and creative writing.',
      image: '/api/placeholder/400/300',
      status: 'completed',
      participants: 100,
      location: 'Cape Coast, Ghana',
      duration: '6 months',
      category: 'Arts',
      impact: '15 youth secured arts-related opportunities',
      supportNeeded: false,
    },
  ]

  // const categories = ['All', 'Technology', 'Business', 'Agriculture', 'Education', 'Health', 'Arts']

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Programs</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover our comprehensive range of programs designed to empower youth 
            and create lasting positive change in communities across Ghana.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">6</div>
              <div className="text-gray-600">Active Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">710+</div>
              <div className="text-gray-600">Youth Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current & Past Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our programs are designed to address the diverse needs of young people 
              and create opportunities for growth and development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Program Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Target className="h-16 w-16 text-gray-400" />
                </div>

                {/* Program Content */}
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      program.status === 'ongoing' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {program.status === 'ongoing' ? 'Active' : 'Completed'}
                    </span>
                    <span className="text-sm text-gray-500">{program.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">{program.description}</p>

                  {/* Program Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{program.participants} participants</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{program.duration}</span>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="bg-green-50 p-3 rounded-md mb-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">{program.impact}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {program.supportNeeded ? (
                    <Link
                      href={`/programs/${program.id}`}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-center font-medium transition-colors block"
                    >
                      Support This Project
                    </Link>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-md text-center font-medium">
                      Program Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Support Our Programs</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your support helps us continue our mission of empowering youth and building 
            stronger communities. Every contribution makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Make a Donation
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
