'use client'

import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, AlertTriangle, Users, BarChart3, Shield, LogOut } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AppPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in')
    }
  }, [isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">SPARK</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email} ({user?.role?.toUpperCase()})
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Water Quality Monitoring System
          </h2>
          <p className="text-lg text-gray-600">
            {user?.role === 'public' 
              ? 'Stay informed about water quality in your area'
              : 'Manage and monitor water quality across your region'
            }
          </p>
        </div>

        {/* Role-based Content */}
        {user?.role === 'public' ? (
          // Public user content
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                  Water Status
                </CardTitle>
                <CardDescription>Current water quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">Good</div>
                  <p className="text-sm text-gray-600">Safe for consumption</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  Alerts
                </CardTitle>
                <CardDescription>Active notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400 mb-2">None</div>
                  <p className="text-sm text-gray-600">No active alerts</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  Emergency
                </CardTitle>
                <CardDescription>Report issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Button variant="outline" className="w-full">
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Admin/ASHA/Leader content
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                  Dashboard
                </CardTitle>
                <CardDescription>View analytics and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button className="w-full">
                    Open Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-2" />
                  Manage Users
                </CardTitle>
                <CardDescription>User administration</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/role-management">
                  <Button variant="outline" className="w-full">
                    Manage Roles
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplets className="h-5 w-5 text-cyan-600 mr-2" />
                  Water Testing
                </CardTitle>
                <CardDescription>Quality assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/water-quality">
                  <Button variant="outline" className="w-full">
                    Start Testing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
