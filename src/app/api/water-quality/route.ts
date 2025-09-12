import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received body:', body)
    
    // Transform the parameters to match the ML API expected format
    const mlApiPayload = {
      Chloramines: body.chloramines || 0,
      Conductivity: body.conductivity || 0,
      Hardness: body.hardness || 0,
      Organic_carbon: body.organic_carbon || 0,
      Solids: body.solids || 0,
      Sulfate: body.sulfate || 0,
      Trihalomethanes: body.trihalomethanes || 0,
      Turbidity: body.turbidity || 0,
      ph: body.ph || 7
    }
    
    console.log('Sending to ML API:', mlApiPayload)
    
    // Make the request to your Water Quality ML API
    const response = await fetch('https://waterborne-risk-api-osl1.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mlApiPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ML API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`)
    }

    const data = await response.json()
    console.log('ML API Response:', data)
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Water Quality API error:', error)
    return NextResponse.json(
      { error: 'Failed to get water quality prediction from ML service' },
      { status: 500 }
    )
  }
}
