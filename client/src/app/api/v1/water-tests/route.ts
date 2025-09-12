import { NextRequest, NextResponse } from 'next/server'

// Type definitions
interface WaterTestPayload {
  waterbodyName: string
  testType?: "Surveillance" | "Routine" | "Emergency"
  priority?: "Low" | "Medium" | "High"
  conductedBy?: string
  waterbodyId?: string
  dateTime: string
  location?: string
  latitude?: number
  longitude?: number
  photoUrl?: string
  notes?: string
  waterQualityParams?: {
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
  mlPrediction?: {
    predicted_class: number
    probabilities: {
      "0": number
      "1": number
      "2": number
    }
  }
  quality?: {
    ph?: number
    turbidity?: number
    conductivity?: number
    hardness?: number
    chloramines?: number
    sulfate?: number
    solids?: number
    organic_carbon?: number
    trihalomethanes?: number
    predicted_class?: number
    risk_probabilities?: {
      "0": number
      "1": number
      "2": number
    }
  }
}

const BACKEND_API_URL = 'https://sihspark.onrender.com/api/v1'

// Helper function to forward auth headers
function getAuthHeaders(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (authHeader) {
    headers.Authorization = authHeader
  }
  
  return headers
}

// Helper function to check if user is authenticated
function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAuthenticated: false, token: null }
  }
  
  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  return { isAuthenticated: true, token }
}

// GET /api/v1/water-tests/all (admin only)
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/water-tests/all`, {
      headers: getAuthHeaders(request),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Error fetching water tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch water tests' },
      { status: 500 }
    )
  }
}

// POST /api/v1/water-tests (asha or admin)
export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const { isAuthenticated, token } = checkAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required. Please provide a valid Bearer token.' },
        { status: 401 }
      )
    }

    const payload: WaterTestPayload = await request.json()
    
    console.log('Received payload:', JSON.stringify(payload, null, 2))

    // Validate required fields (backend expects these to be present)
    if (!payload.waterbodyName || !payload.dateTime) {
      return NextResponse.json(
        { error: 'waterbodyName and dateTime are required' },
        { status: 400 }
      )
    }

    // Transform payload to match backend expectations
    // Map priority to quality string expected by backend
    const getQualityFromPriority = (priority?: string) => {
      switch (priority) {
        case 'Low': return 'good'
        case 'Medium': return 'medium'  
        case 'High': return 'high'
        default: return 'medium'
      }
    }

    const backendPayload = {
      waterbodyName: payload.waterbodyName,
      dateTime: payload.dateTime,
      location: payload.location || '',
      photoUrl: payload.photoUrl || '',
      notes: payload.notes || '',
      quality: getQualityFromPriority(payload.priority)
    }

    console.log('Transformed backend payload:', JSON.stringify(backendPayload, null, 2))

    // If quality parameters are provided, analyze with ML model first
    const enhancedPayload = { ...payload }
    
    if (payload.quality && hasCompleteQualityData(payload.quality)) {
      try {
        const mlResponse = await fetch(`${request.nextUrl.origin}/api/water-quality`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ph: payload.quality.ph,
            turbidity: payload.quality.turbidity,
            conductivity: payload.quality.conductivity,
            hardness: payload.quality.hardness,
            chloramines: payload.quality.chloramines,
            sulfate: payload.quality.sulfate,
            solids: payload.quality.solids,
            organic_carbon: payload.quality.organic_carbon,
            trihalomethanes: payload.quality.trihalomethanes
          }),
        })

        if (mlResponse.ok) {
          const mlResults = await mlResponse.json()
          // Enhance the payload with ML results
          enhancedPayload.quality = {
            ...payload.quality,
            predicted_class: mlResults.predicted_class,
            risk_probabilities: mlResults.probabilities
          }
        }
      } catch (error) {
        console.error('ML analysis failed:', error)
        // Continue without ML results
      }
    }

    // Forward to backend API
    const response = await fetch(`${BACKEND_API_URL}/water-tests`, {
      method: 'POST',
      headers: getAuthHeaders(request),
      body: JSON.stringify(backendPayload),
    })

    if (!response.ok) {
      console.error(`Backend API error: ${response.status} ${response.statusText}`)
      let errorMessage = 'Failed to create water test'
      
      try {
        const errorData = await response.json()
        console.error('Backend error details:', errorData)
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch (e) {
        console.error('Could not parse backend error response')
      }
      
      return NextResponse.json(
        { error: errorMessage, status: response.status },
        { status: response.status }
      )
    }    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Error creating water test:', error)
    return NextResponse.json(
      { error: 'Failed to create water test' },
      { status: 500 }
    )
  }
}

// Helper function to check if quality data is complete for ML analysis
function hasCompleteQualityData(quality: Record<string, unknown>): boolean {
  const requiredFields = ['ph', 'turbidity', 'conductivity', 'hardness', 'chloramines', 'sulfate', 'solids', 'organic_carbon', 'trihalomethanes']
  return requiredFields.every(field => 
    quality[field] !== undefined && 
    quality[field] !== null && 
    !isNaN(Number(quality[field]))
  )
}
