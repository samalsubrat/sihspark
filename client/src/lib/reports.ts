interface Report {
  id: string
  name: string
  location?: string
  latitude?: number
  longitude?: number
  date: string
  mapArea?: string | object
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
  mapArea?: string | object
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

// Use internal Next.js API routes. They proxy to the backend and handle auth forwarding.
const INTERNAL_API_BASE = '/api/reports'

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
    const response = await fetch(`${INTERNAL_API_BASE}`, {
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
  const response = await fetch(`${INTERNAL_API_BASE}`, {
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
    const data = await response.json()
    // Normalize various possible backend shapes into { reports: Report[] }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let reports: unknown = (data && typeof data === 'object') ? (data as any).reports : data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (Array.isArray((data as any)?.data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reports = (data as any).data
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!Array.isArray(reports) && Array.isArray((data as any)?.items)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reports = (data as any).items
    }
    if (!Array.isArray(reports)) {
      console.warn('Unexpected reports response shape; falling back to empty list. Raw:', data)
      reports = []
    }
    return { reports: reports as Report[] }
  }

  static async updateReport(id: string, payload: UpdateReportPayload): Promise<UpdateReportResponse> {
    const response = await fetch(`${INTERNAL_API_BASE}/${id}`, {
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
    const response = await fetch(`${INTERNAL_API_BASE}/${id}`, {
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