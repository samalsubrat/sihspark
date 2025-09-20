// Outbreak Prediction Types and Service

interface OutbreakPredictionInput {
  reported_cases: number
  turbidity_ntu: number
  ph_level: number
  rainfall_mm: number
  e_coli_present: 0 | 1
  population_density: number
  proximity_to_river: number
  cases_7_day_avg: number
  rainfall_3_day_sum: number
  cases_7_days_ago: number
}

interface OutbreakPredictionOutput {
  outbreak_risk_probability: number
  timestamp: string
}

interface OutbreakPredictionResponse {
  prediction: OutbreakPredictionOutput
}

// API Service for outbreak predictions
export class OutbreakPredictionService {
  private static readonly API_BASE_URL = '/api/outbreak-prediction'

  private static getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  static async predictOutbreak(input: OutbreakPredictionInput): Promise<OutbreakPredictionResponse> {
    const response = await fetch(this.API_BASE_URL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to predict outbreak risk'
      try {
        const error = await response.json()
        errorMessage = error.message || error.error || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return {
      prediction: {
        outbreak_risk_probability: data.outbreak_risk_probability,
        timestamp: data.timestamp
      }
    }
  }

  static getRiskLevel(probability: number): 'low' | 'medium' | 'high' | 'critical' {
    if (probability <= 0.25) return 'low'
    if (probability <= 0.5) return 'medium'
    if (probability <= 0.75) return 'high'
    return 'critical'
  }

  static getRiskLevelColor(probability: number): string {
    const level = this.getRiskLevel(probability)
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  static getRiskLevelText(probability: number): string {
    const level = this.getRiskLevel(probability)
    const percentage = (probability * 100).toFixed(1)
    switch (level) {
      case 'low':
        return `Low Risk (${percentage}%)`
      case 'medium':
        return `Medium Risk (${percentage}%)`
      case 'high':
        return `High Risk (${percentage}%)`
      case 'critical':
        return `Critical Risk (${percentage}%)`
    }
  }

  static formatTimestamp(timestamp: string): string {
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return timestamp
    }
  }
}

export type { 
  OutbreakPredictionInput, 
  OutbreakPredictionOutput, 
  OutbreakPredictionResponse 
}
