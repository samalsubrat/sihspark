"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthService, User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, role: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Sync token from localStorage to cookie for middleware
        AuthService.syncTokenToCookie()
        
        // Check if we have a token in localStorage or cookies
        if (AuthService.isAuthenticatedWithCookie()) {
          try {
            const userData = await AuthService.getProfile()
            setUser(userData)
          } catch (error) {
            console.error('Failed to fetch user profile:', error)
            // If profile fetch fails, clear the token
            AuthService.logout()
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        // Clear any invalid tokens
        AuthService.logout()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string, role: string) => {
    try {
      const response = await AuthService.signin({ email, password, role })
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const response = await AuthService.signup({ email, password })
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    AuthService.logout()
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user || AuthService.isAuthenticatedWithCookie(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}