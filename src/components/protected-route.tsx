"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/sign-in' 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated || !user) {
    router.push(redirectTo)
    return null
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required roles: {allowedRoles.join(', ')}
          </p>
          <p className="text-sm text-gray-500">
            Your role: {user.role}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
