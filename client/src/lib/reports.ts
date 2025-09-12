interface Report {
  id: string
  name: string
  location?: string
  latitude?: number
  longitude?: number
  date: string
  mapArea?: string
  leaderId: string
  photoUrl?: string
  comment?: string
  status: 'awaiting' | 'in_progress' | 'resolved'
  progress: number
}

interface CreateReportPayload {
  name: string
  location?: string
  latitude?: number
  longitude?: number
  date: string
  mapArea?: string
  leaderId: string
  photoUrl?: string
  comment?: string
}

interface UpdateReportPayload {
  status?: 'awaiting' | 'in_progress' | 'resolved'
  progress?: number
}

interface ReportsResponse {
  reports: Report[]
}

interface CreateReportResponse {
  report: {
    id: string
  }
}

interface UpdateReportResponse {
  report: {
    id: string
    status: string
    progress: number
  }
}

interface DeleteReportResponse {
  deleted: boolean
}

const API_BASE_URL = 'http://sihspark.onrender.com/api/v1'

export class ReportsService {
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    console.log('Making API request with token:', token ? 'Token present' : 'No token found')
    if (token) {
      console.log('Authorization header:', `Bearer ${token.substring(0, 20)}...`)
    }
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  static async createReport(payload: CreateReportPayload): Promise<CreateReportResponse> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to create report'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async getReports(): Promise<ReportsResponse> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch reports'
      
      if (response.status === 401) {
        errorMessage = 'Authentication required - please sign in'
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden - insufficient permissions'
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

  static async updateReport(id: string, payload: UpdateReportPayload): Promise<UpdateReportResponse> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to update report'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async deleteReport(id: string): Promise<DeleteReportResponse> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to delete report'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }
}

export type { Report, CreateReportPayload, UpdateReportPayload }
