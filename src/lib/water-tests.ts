interface WaterTest {
  id: string
  waterbody_name: string
  test_type: "Surveillance" | "Routine" | "Emergency"
  priority: "Low" | "Medium" | "High"
  conducted_by: string
  chloramines: number
  conductivity: number
  hardness: number
  organic_carbon: number
  solids: number
  sulfate: number
  trihalomethanes: number
  turbidity: number
  ph: number
  predicted_class: number
  risk_probabilities: {
    "0": number
    "1": number
    "2": number
  }
  status: "Pending" | "Completed"
  created_at: string
}

interface CreateWaterTestPayload {
  waterbodyName: string
  testType: "Surveillance" | "Routine" | "Emergency"
  priority: "Low" | "Medium" | "High"
  conductedBy: string
  waterQualityParams: {
    Chloramines: number
    Conductivity: number
    Hardness: number
    Organic_carbon: number
    Solids: number
    Sulfate: number
    Trihalomethanes: number
    Turbidity: number
    ph: number
  }
  mlPrediction: {
    predicted_class: number
    probabilities: {
      "0": number
      "1": number
      "2": number
    }
  }
}

interface UpdateWaterTestPayload {
  waterbodyName?: string
  dateTime?: string
  location?: string
  latitude?: number
  longitude?: number
  photoUrl?: string
  notes?: string
  quality?: object
  status?: 'pending' | 'completed'
}

class WaterTestsService {
  private static baseUrl = '/api/v1/water-tests'

  static async getWaterTests(): Promise<WaterTest[]> {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(this.baseUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch water tests')
    }

    return await response.json()
  }

  static async getAllWaterTests(): Promise<WaterTest[]> {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${this.baseUrl}/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch all water tests')
    }

    return await response.json()
  }

  static async createWaterTest(payload: CreateWaterTestPayload): Promise<WaterTest> {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      throw new Error('Authentication required. Please log in.')
    }
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.')
      }
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Failed to create water test (${response.status})`)
    }

    return await response.json()
  }

  static async updateWaterTest(id: string, payload: UpdateWaterTestPayload): Promise<WaterTest> {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update water test')
    }

    return await response.json()
  }

  static async deleteWaterTest(id: string): Promise<void> {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete water test')
    }
  }

  // Call ML model for water quality analysis
  static async analyzeWaterQuality(params: {
    ph: number
    turbidity: number
    conductivity: number
    hardness: number
    chloramines: number
    sulfate: number
    solids: number
    organic_carbon: number
    trihalomethanes: number
  }) {
    const response = await fetch('/api/water-quality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze water quality')
    }

    return await response.json()
  }
}

export { WaterTestsService }
export type { 
  WaterTest, 
  CreateWaterTestPayload, 
  UpdateWaterTestPayload 
}
