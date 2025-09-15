import { Users, Target, Heart, MapPin, Phone, Mail } from 'lucide-react'

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Kwame Asante',
      role: 'Executive Director',
      bio: 'Leading our organization with over 10 years of experience in youth development and community engagement.',
      image: '/api/placeholder/150/150',
    },
    {
      name: 'Ama Osei',
      role: 'Programs Manager',
      bio: 'Overseeing our educational and skills training programs to ensure maximum impact.',
      image: '/api/placeholder/150/150',
    },
    {
      name: 'Kofi Mensah',
      role: 'Community Outreach Coordinator',
      bio: 'Building partnerships and connecting with communities across Ghana.',
      image: '/api/placeholder/150/150',
    },
    {
      name: 'Efua Addo',
      role: 'Finance & Operations',
      bio: 'Managing our resources efficiently to maximize our impact on youth development.',
      image: '/api/placeholder/150/150',
    },
  ]

  const values = [
    {
      title: 'Empowerment',
      description: 'We believe in giving young people the tools and confidence to take control of their future.',
      icon: '💪',
    },
    {
      title: 'Inclusivity',
      description: 'Our programs are designed to reach and support youth from all backgrounds and communities.',
      icon: '🤝',
    },
    {
      title: 'Innovation',
      description: 'We continuously adapt and improve our approaches to meet evolving youth needs.',
      icon: '💡',
    },
    {
      title: 'Sustainability',
      description: 'We build programs that create lasting positive change in communities.',
      icon: '🌱',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Boa Me</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Empowering Youth, Building Futures. Learn about our mission, vision, and the team 
            behind our commitment to youth development in Ghana.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-green-50 p-8 rounded-lg">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Boa Me Youth Empowerment is dedicated to transforming the lives of young people 
                in Ghana through comprehensive education, skills development, and community engagement programs.
              </p>
              <p className="text-gray-700">
                We believe that every young person deserves the opportunity to reach their full potential, 
                regardless of their background or circumstances. Our holistic approach addresses not just 
                educational needs, but also life skills, mental health, and community involvement.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 mb-4">
                To create a Ghana where every young person has access to quality education, 
                meaningful employment opportunities, and the resources needed to contribute 
                positively to their community and nation.
              </p>
              <p className="text-gray-700">
                We envision a future where youth are not just beneficiaries of development, 
                but active participants and leaders in building stronger, more sustainable communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded in 2019, Boa Me Youth Empowerment began with a simple belief: 
              that young people have the power to transform their communities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How It All Started</h3>
              <p className="text-gray-600 mb-4">
                Our journey began when a group of concerned citizens in Accra recognized the 
                challenges facing young people in their community. Many youth lacked access 
                to quality education, skills training, and opportunities for meaningful employment.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small community initiative has grown into a comprehensive 
                youth development organization serving multiple communities across Ghana.
              </p>
              <p className="text-gray-600">
                Today, we&apos;re proud to have empowered hundreds of young people and continue 
                to expand our reach and impact every day.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Milestones</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">2019 - Foundation</h5>
                    <p className="text-gray-600 text-sm">Organization established with first community program</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">2021 - Expansion</h5>
                    <p className="text-gray-600 text-sm">Launched skills training and entrepreneurship programs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">2023 - Growth</h5>
                    <p className="text-gray-600 text-sm">Reached 500+ youth across 15 communities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">2024 - Innovation</h5>
                    <p className="text-gray-600 text-sm">Launched digital skills and e-commerce training</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape our approach to youth development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated professionals who are passionate about youth development 
              and committed to making a difference in Ghana.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-600 text-black p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Want to learn more about our work or get involved? We&apos;d love to hear from you.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center text-black">
                <Mail className="h-6 w-6 mr-3" />
                <span>boamenameboawo@gmail.com</span>
              </div>
              <div className="flex items-center justify-center text-black">
                <Phone className="h-6 w-6 mr-3" />
                <span>+233 54 481 8418</span>
              </div>
              <div className="flex items-center justify-center text-black">
                <MapPin className="h-6 w-6 mr-3" />
                <span>Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
