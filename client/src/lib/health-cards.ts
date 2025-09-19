// Health Card Types and Service
interface ContaminationEvent {
  date: string
  quality: 'medium' | 'high' | 'disease'
  location?: string
  notes?: string
  severity: 'medium' | 'high' | 'critical'
}

interface HealthCard {
  id: string
  waterbodyName: string
  waterbodyId: string
  location: string
  latitude?: number
  longitude?: number
  riskScore: number
  lastTestedDate?: string
  contaminationHistory: ContaminationEvent[]
  qrCode: string
  createdAt: string
  updatedAt: string
}

interface CreateHealthCardPayload {
  waterbodyName: string
  waterbodyId?: string
  location: string
  latitude?: number
  longitude?: number
}

interface HealthCardResponse {
  healthCard: HealthCard
}

interface HealthCardsResponse {
  healthCards: HealthCard[]
}

// Internal API base URL
const INTERNAL_API_BASE = '/api/health-cards'

export class HealthCardService {
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

  // Create or update health card
  static async createHealthCard(payload: CreateHealthCardPayload): Promise<HealthCardResponse> {
    const response = await fetch(INTERNAL_API_BASE, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to create health card'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  // Get all health cards
  static async getHealthCards(): Promise<HealthCardsResponse> {
    const response = await fetch(INTERNAL_API_BASE, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch health cards'
      
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
    return data
  }

  // Get health card by waterbody ID (public access)
  static async getHealthCard(waterbodyId: string): Promise<HealthCardResponse> {
    const response = await fetch(`${INTERNAL_API_BASE}/${waterbodyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch health card'
      
      if (response.status === 404) {
        errorMessage = 'Health card not found'
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

  // Refresh health card data
  static async refreshHealthCard(waterbodyId: string): Promise<HealthCardResponse> {
    const response = await fetch(`${INTERNAL_API_BASE}/${waterbodyId}/refresh`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to refresh health card'
      
      if (response.status === 404) {
        errorMessage = 'Health card not found'
      } else {
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  // Utility function to get risk level color
  static getRiskLevelColor(riskScore: number): string {
    if (riskScore <= 30) return 'bg-green-100 text-green-800 border-green-200'
    if (riskScore <= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (riskScore <= 85) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  // Utility function to get risk level text
  static getRiskLevelText(riskScore: number): string {
    if (riskScore <= 30) return 'Low Risk'
    if (riskScore <= 60) return 'Medium Risk'
    if (riskScore <= 85) return 'High Risk'
    return 'Critical Risk'
  }

  // Utility function to get severity color
  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
}

export type {
  HealthCard,
  ContaminationEvent,
  CreateHealthCardPayload,
  HealthCardResponse,
  HealthCardsResponse
}
