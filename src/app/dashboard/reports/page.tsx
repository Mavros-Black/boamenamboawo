'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  const { user } = useAuth()
  const router = useRouter()

  const reports = [
    {
      id: '1',
      name: 'Monthly Donations Report',
      description: 'Comprehensive report of all donations for the current month',
      type: 'donations',
      lastGenerated: '2024-01-20',
      status: 'ready'
    },
    {
      id: '2',
      name: 'User Activity Report',
      description: 'Detailed analysis of user engagement and activity',
      type: 'users',
      lastGenerated: '2024-01-19',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Financial Summary Report',
      description: 'Complete financial overview including revenue and expenses',
      type: 'finance',
      lastGenerated: '2024-01-18',
      status: 'ready'
    },
    {
      id: '4',
      name: 'Program Performance Report',
      description: 'Analysis of program effectiveness and participant feedback',
      type: 'programs',
      lastGenerated: '2024-01-17',
      status: 'generating'
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
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and manage reports</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Generate New Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Download className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ready to Download</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'ready').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Reports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-500">{report.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    report.status === 'ready' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-900">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Donations Report</h4>
            <p className="text-sm text-gray-500 mt-1">Monthly summary of all donations</p>
            <button className="mt-3 text-sm text-green-600 hover:text-green-700">
              Generate →
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">User Activity Report</h4>
            <p className="text-sm text-gray-500 mt-1">User engagement and activity metrics</p>
            <button className="mt-3 text-sm text-green-600 hover:text-green-700">
              Generate →
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Financial Report</h4>
            <p className="text-sm text-gray-500 mt-1">Complete financial overview</p>
            <button className="mt-3 text-sm text-green-600 hover:text-green-700">
              Generate →
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Program Report</h4>
            <p className="text-sm text-gray-500 mt-1">Program performance and feedback</p>
            <button className="mt-3 text-sm text-green-600 hover:text-green-700">
              Generate →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

