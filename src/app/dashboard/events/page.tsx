'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react'

export default function EventsPage() {
  const { user } = useAuth()
  const router = useRouter()

  const events = [
    {
      id: '1',
      name: 'Youth Empowerment Workshop',
      description: 'Interactive workshop focused on leadership and communication skills',
      date: '2024-02-15',
      time: '10:00 AM',
      location: 'Community Center, Accra',
      attendees: 45,
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Fundraising Gala',
      description: 'Annual fundraising event to support youth programs',
      date: '2024-03-20',
      time: '7:00 PM',
      location: 'Grand Hotel, Accra',
      attendees: 120,
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Digital Skills Training',
      description: 'Training session on modern digital tools and technologies',
      date: '2024-01-25',
      time: '2:00 PM',
      location: 'Tech Hub, Accra',
      attendees: 32,
      status: 'completed'
    }
  ]

  const userRole = user?.user_metadata?.role || 'user'
    if (userRole !== 'admin') {
      router.push('/dashboard/user')
      return
    }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600">Manage upcoming and past events</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + e.attendees, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{event.name}</div>
                    <div className="text-sm text-gray-500">{event.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{new Date(event.date).toLocaleDateString()}</div>
                  <div className="text-gray-500">{event.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.attendees}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    event.status === 'upcoming' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

