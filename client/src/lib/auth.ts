interface User {
  id: string
  email: string
  role: string
  name: string
  createdAt: string
}

interface AuthResponse {
  token: string
  user: User
}

interface SignupPayload {
  email: string
  password: string
}

interface SigninPayload {
  email: string
  password: string
  role: string
}

const API_BASE_URL = 'http://sihspark.onrender.com/api/v1'

export class AuthService {
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      // Also set as httpOnly cookie for middleware
      document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
    }
  }

  private static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      // Remove cookie as well
      document.cookie = 'auth_token=; path=/; max-age=0'
    }
  }

  static async signup(payload: SignupPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Signup failed')
    }

    const data: AuthResponse = await response.json()
    this.setToken(data.token)
    return data
  }

  static async signin(payload: SigninPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Signin failed')
    }

    const data: AuthResponse = await response.json()
    this.setToken(data.token)
    return data
  }

  static async getProfile(): Promise<User> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken()
        throw new Error('Authentication expired')
      }
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch profile')
    }

    const data = await response.json()
    return data.user
  }

  static logout(): void {
    this.removeToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/sign-in'
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export type { User, AuthResponse, SignupPayload, SigninPayload }
