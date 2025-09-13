interface Alert {
  id: string
  message: string
  createdAt: string
  type: 'leader' | 'global'
  leader?: {
    id: string
    name: string
    email: string
  }
  waterTest: {
    id: string
    waterbodyName: string
    location: string
    quality: 'good' | 'medium' | 'high' | 'disease'
    dateTime: string
    asha: {
      id: string
      name: string
      email: string
    }
  }
}

interface AlertStats {
  totalLeaderAlerts: number
  totalGlobalAlerts: number
  totalAlerts: number
  recentAlerts: number
}

interface AlertsResponse {
  alerts: Alert[]
  nextCursor: string | null
}

interface AlertStatsResponse {
  stats: AlertStats
}

const API_BASE_URL = 'https://sihspark.onrender.com.onrender.com/api/v1'

export class AlertService {
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

  static async getAllAlerts(limit?: number, cursor?: string): Promise<AlertsResponse> {
    const queryParams = new URLSearchParams()
    
    if (limit) queryParams.append('limit', limit.toString())
    if (cursor) queryParams.append('cursor', cursor)

    const url = `${API_BASE_URL}/alerts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch alerts'
      
      if (response.status === 401) {
        errorMessage = 'Authentication required - please sign in'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - leader or admin role required'
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

  static async getLeaderAlerts(limit?: number, cursor?: string): Promise<AlertsResponse> {
    const queryParams = new URLSearchParams()
    
    if (limit) queryParams.append('limit', limit.toString())
    if (cursor) queryParams.append('cursor', cursor)

    const url = `${API_BASE_URL}/alerts/leader${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch leader alerts'
      
      if (response.status === 401) {
        errorMessage = 'Authentication required - please sign in'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - leader or admin role required'
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

  static async getGlobalAlerts(limit?: number, cursor?: string): Promise<AlertsResponse> {
    const queryParams = new URLSearchParams()
    
    if (limit) queryParams.append('limit', limit.toString())
    if (cursor) queryParams.append('cursor', cursor)

    const url = `${API_BASE_URL}/alerts/global${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch global alerts'
      
      if (response.status === 401) {
        errorMessage = 'Authentication required - please sign in'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - leader or admin role required'
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

  static async getAlertStats(): Promise<AlertStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/alerts/stats`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch alert statistics'
      
      if (response.status === 401) {
        errorMessage = 'Authentication required - please sign in'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - leader or admin role required'
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
}

export type { Alert, AlertStats, AlertsResponse, AlertStatsResponse }