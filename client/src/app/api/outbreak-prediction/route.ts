import { NextRequest, NextResponse } from 'next/server'

interface OutbreakPredictionInput {
  reported_cases: number
  turbidity_ntu: number
  ph_level: number
  rainfall_mm: number
  e_coli_present: number
  population_density: number
  proximity_to_river: number
  cases_7_day_avg: number
  rainfall_3_day_sum: number
  cases_7_days_ago: number
}

const MODEL_API_URL = 'https://sihspark-g02b.onrender.com'

export async function POST(request: NextRequest) {
  let body: OutbreakPredictionInput
  try {
    body = await request.json()
    
    // Validate required fields
    const requiredFields: (keyof OutbreakPredictionInput)[] = [
      'reported_cases',
      'turbidity_ntu', 
      'ph_level',
      'rainfall_mm',
      'e_coli_present',
      'population_density',
      'proximity_to_river',
      'cases_7_day_avg',
      'rainfall_3_day_sum',
      'cases_7_days_ago'
    ]
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Make request to the outbreak prediction model
    const response = await fetch(`${MODEL_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error('Model API error:', response.status, response.statusText)
      
      // If service is unavailable, return demo prediction instead of error
      if (response.status === 503 || response.status === 502 || response.status === 504) {
        console.log('Model service unavailable, generating demo prediction')
        return generateDemoPrediction(body)
      }
      
      return NextResponse.json(
        { error: `Model API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Outbreak prediction API error:', error)
    
    // Return demo prediction instead of error
    // Create a fallback body with default values if parsing failed
    const fallbackBody: OutbreakPredictionInput = {
      reported_cases: 0,
      turbidity_ntu: 5,
      ph_level: 7,
      rainfall_mm: 10,
      e_coli_present: 0,
      population_density: 500,
      proximity_to_river: 5,
      cases_7_day_avg: 0,
      rainfall_3_day_sum: 20,
      cases_7_days_ago: 0
    }
    return generateDemoPrediction(fallbackBody)
  }
}

// Generate a realistic demo prediction based on input parameters
function generateDemoPrediction(input: OutbreakPredictionInput) {
  // Calculate a demo risk based on input parameters for realism
  let riskScore = 0.3 // Base risk
  
  // Increase risk based on various factors
  if (input.e_coli_present === 1) riskScore += 0.2
  if (input.turbidity_ntu > 10) riskScore += 0.15
  if (input.ph_level < 6.5 || input.ph_level > 8.5) riskScore += 0.1
  if (input.rainfall_mm > 20) riskScore += 0.1
  if (input.population_density > 1000) riskScore += 0.05
  if (input.proximity_to_river <= 2) riskScore += 0.1
  if (input.cases_7_day_avg > input.cases_7_days_ago) riskScore += 0.15
  if (input.rainfall_3_day_sum > 50) riskScore += 0.05
  
  // Add some randomness but keep it realistic
  const randomFactor = (Math.random() - 0.5) * 0.1
  riskScore = Math.max(0.05, Math.min(0.95, riskScore + randomFactor))
  
  const demoResponse = {
    outbreak_risk_probability: riskScore,
    timestamp: new Date().toISOString(),
    isDemo: true,
    message: 'Model temporarily unavailable. Showing calculated demo prediction based on your inputs.'
  }
  
  return NextResponse.json(demoResponse, { status: 200 })
}
