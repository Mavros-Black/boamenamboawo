'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Settings, Save, Bell, Shield, Globe } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletterSubscriptions: true,
    twoFactorAuth: false,
    language: 'en',
    timezone: 'Africa/Accra'
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application settings</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-blue-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Newsletter Subscriptions</p>
                <p className="text-sm text-gray-500">Receive our monthly newsletter</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.newsletterSubscriptions}
                  onChange={(e) => handleSettingChange('newsletterSubscriptions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-green-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Change Password</p>
              <button className="text-sm text-green-600 hover:text-green-700">
                Update Password →
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-purple-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Africa/Accra">Africa/Accra (GMT+0)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-gray-500 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Name
              </label>
              <input
                type="text"
                value={user?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Role
              </label>
              <input
                type="text"
                value={user?.role || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 capitalize"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

