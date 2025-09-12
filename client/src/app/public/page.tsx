"use client"

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Droplets, AlertTriangle, Phone, LogOut } from 'lucide-react'

export default function PublicPage() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">
                Water Quality Monitor
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Water Quality Information
          </h2>
          <p className="text-lg text-gray-600">
            Stay informed about water quality in your area
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Water Quality Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                Current Status
              </CardTitle>
              <CardDescription>
                Latest water quality information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">Good</div>
                <p className="text-sm text-gray-600">
                  Water quality is within safe parameters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                Alerts
              </CardTitle>
              <CardDescription>
                Important notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-2">None</div>
                <p className="text-sm text-gray-600">
                  No active alerts at this time
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-2" />
                Emergency Contact
              </CardTitle>
              <CardDescription>
                Report water quality issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  1800-XXX-WATER
                </div>
                <p className="text-sm text-gray-600">
                  24/7 helpline for water emergencies
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>About Water Quality Monitoring</CardTitle>
              <CardDescription>
                Important information for the public
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What We Monitor</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• pH levels</li>
                    <li>• Dissolved oxygen</li>
                    <li>• Turbidity</li>
                    <li>• Chemical contaminants</li>
                    <li>• Bacterial indicators</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How to Help</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Report unusual water conditions</li>
                    <li>• Follow boil water advisories</li>
                    <li>• Conserve water resources</li>
                    <li>• Dispose of chemicals properly</li>
                    <li>• Stay informed about updates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
