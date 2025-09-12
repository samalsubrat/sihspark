"use client"

import React from "react"
import { UsersTable } from "@/components/admin-users-table"
import { useAuth } from "@/contexts/auth-context"

export default function RoleManagementPage() {
  const { user } = useAuth()

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Role Management</h1>
          <p className="text-gray-600">
            Manage user roles, permissions, and access control across the system
          </p>
          <div className="mt-2 text-sm text-blue-600">
            Logged in as: <span className="font-medium">{user.email}</span> ({user.role})
          </div>
        </div>

        <UsersTable 
          currentUser={user}
        />
      </div>
    </div>
  )
}
