interface User {
  id: string
  email: string
  role: 'asha' | 'leader' | 'admin' | 'public'
  name?: string
  createdAt: string
}

interface CreateUserPayload {
  email: string
  password: string
  role: 'asha' | 'leader' | 'admin' | 'public'
  name?: string
}

interface UpdateUserPayload {
  email?: string
  password?: string
  role?: 'asha' | 'leader' | 'admin' | 'public'
  name?: string
}

interface ListUsersResponse {
  users: User[]
  nextCursor: string | null
}

interface UserActivity {
  id: string
  email: string
  role: string
  name?: string
  lastActivity?: string
  createdAt: string
}

interface CreateUserResponse {
  user: {
    id: string
    email: string
    role: string
  }
}

interface UpdateUserResponse {
  user: {
    id: string
    email: string
    role: string
    name?: string
  }
}

interface DeleteUserResponse {
  deleted: boolean
}

interface GetUserResponse {
  user: User
}

interface ListUsersParams {
  role?: string
  email?: string
  q?: string
  limit?: number
  cursor?: string
}

const API_BASE_URL = 'https://sihspark.onrender.com/api/v1'

export class AdminService {
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  static async listUsers(params?: ListUsersParams): Promise<ListUsersResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.role) queryParams.append('role', params.role)
    if (params?.email) queryParams.append('email', params.email)
    if (params?.q) queryParams.append('q', params.q)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.cursor) queryParams.append('cursor', params.cursor)

    const url = `${API_BASE_URL}/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch users'
      
      if (response.status === 401) {
        errorMessage = 'Authentication required - please sign in'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - admin role required'
      } else {
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          errorMessage = `${response.status} ${response.statusText}` || errorMessage
        }
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to create user'
      
      if (response.status === 400) {
        const error = await response.json()
        errorMessage = error.message || 'Invalid user data'
      } else if (response.status === 409) {
        errorMessage = 'Email already exists'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - admin role required'
      } else {
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          errorMessage = `${response.status} ${response.statusText}` || errorMessage
        }
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async getUserById(id: string): Promise<GetUserResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch user'
      
      if (response.status === 404) {
        errorMessage = 'User not found'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - admin role required'
      } else {
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          errorMessage = `${response.status} ${response.statusText}` || errorMessage
        }
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async updateUser(id: string, payload: UpdateUserPayload): Promise<UpdateUserResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to update user'
      
      if (response.status === 400) {
        const error = await response.json()
        errorMessage = error.message || 'Invalid user data'
      } else if (response.status === 404) {
        errorMessage = 'User not found'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - admin role required'
      } else {
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          errorMessage = `${response.status} ${response.statusText}` || errorMessage
        }
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async deleteUser(id: string): Promise<DeleteUserResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to delete user'
      
      if (response.status === 404) {
        errorMessage = 'User not found'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - admin role required'
      } else {
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          errorMessage = `${response.status} ${response.statusText}` || errorMessage
        }
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async getRecentUsers(limit: number = 10): Promise<User[]> {
    const response = await this.listUsers({ limit })
    return response.users
  }
}

export type { User, CreateUserPayload, UpdateUserPayload, ListUsersParams, ListUsersResponse, UserActivity }