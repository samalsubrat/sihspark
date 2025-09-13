"use client"

import React, { useState, useEffect } from "react"
import { UsersTable } from "@/components/admin-users-table"
import { useAuth } from "@/contexts/auth-context"
import { AdminService } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, UserX, Shield, Clock, UserPlus } from "lucide-react"

interface UserStats {
  total: number
  asha: number
  leader: number
  admin: number
  public: number
}

export default function RoleManagementPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    asha: 0,
    leader: 0,
    admin: 0,
    public: 0
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Only admin users should access this page
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You need admin privileges to access role management.
          </p>
        </div>
      </div>
    )
  }

  // Load user statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const response = await AdminService.listUsers({ limit: 1000 })
        const users = response.users
        
        const userStats = users.reduce((acc, user) => {
          acc.total++
          acc[user.role as keyof UserStats]++
          return acc
        }, { total: 0, asha: 0, leader: 0, admin: 0, public: 0 } as UserStats)
        
        setStats(userStats)
        setRecentUsers(users.slice(0, 5)) // Get 5 most recent users
      } catch (error) {
        console.error('Failed to load user statistics:', error)
        // Set default stats for demo
        setStats({
          total: 3,
          asha: 1,
          leader: 1,
          admin: 1,
          public: 0
        })
        setRecentUsers([
          {
            id: '1',
            email: 'admin@example.com',
            role: 'admin',
            name: 'System Admin',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            email: 'leader@example.com',
            role: 'leader',
            name: 'Local Leader',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            email: 'asha@example.com',
            role: 'asha',
            name: 'ASHA Worker',
            createdAt: new Date().toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage user roles, permissions, and access control across the system
          </p>
          <div className="mt-2 text-sm text-blue-600">
            Logged in as: <span className="font-medium">{user.email}</span> ({user.role})
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.total}
              </div>
              <p className="text-xs text-gray-500">All registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ASHA Workers</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : stats.asha}
              </div>
              <p className="text-xs text-gray-500">Field workers</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Local Leaders</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "..." : stats.leader}
              </div>
              <p className="text-xs text-gray-500">Community leaders</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loading ? "..." : stats.admin}
              </div>
              <p className="text-xs text-gray-500">System administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* Role Distribution */}
        <Card className="mb-8 bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.asha}</div>
                <div className="text-sm text-green-700 font-medium">ASHA Workers</div>
                <div className="text-xs text-green-600">
                  {stats.total > 0 ? Math.round((stats.asha / stats.total) * 100) : 0}% of total
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.leader}</div>
                <div className="text-sm text-blue-700 font-medium">Local Leaders</div>
                <div className="text-xs text-blue-600">
                  {stats.total > 0 ? Math.round((stats.leader / stats.total) * 100) : 0}% of total
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-1">{stats.admin}</div>
                <div className="text-sm text-red-700 font-medium">Admins</div>
                <div className="text-xs text-red-600">
                  {stats.total > 0 ? Math.round((stats.admin / stats.total) * 100) : 0}% of total
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600 mb-1">{stats.public}</div>
                <div className="text-sm text-gray-700 font-medium">Public Users</div>
                <div className="text-xs text-gray-600">
                  {stats.total > 0 ? Math.round((stats.public / stats.total) * 100) : 0}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="mb-8 bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <UserPlus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name || 'No name'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      user.role === 'admin' ? 'bg-red-100 text-red-800 border-red-200' :
                      user.role === 'leader' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      user.role === 'asha' ? 'bg-green-100 text-green-800 border-green-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }>
                      {user.role === 'admin' ? 'Admin' :
                       user.role === 'leader' ? 'Local Leader' :
                       user.role === 'asha' ? 'ASHA Worker' :
                       'Public User'}
                    </Badge>
                    <div className="text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Management Table */}
        <UsersTable 
          currentUser={user}
        />
      </div>
    </div>
  )
}