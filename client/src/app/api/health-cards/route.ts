import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

// Type definitions
interface WaterTest {
  id?: string
  dateTime?: string
  date?: string
  quality: 'good' | 'medium' | 'high' | 'disease'
  location?: string
  notes?: string
  waterbodyName?: string
}

interface ContaminationEvent {
  date: string
  quality: 'medium' | 'high' | 'disease'
  location?: string
  notes?: string
  severity: 'medium' | 'high' | 'critical'
}
import { randomUUID } from 'crypto'

// Backend API URL
const BACKEND_API_URL = 'https://sihspark.onrender.com/api/v1'

// Auth helpers
function getAuthHeaders(req: NextRequest): Record<string, string> {
  const authorization = req.headers.get('authorization')
  return {
    'Content-Type': 'application/json',
    ...(authorization && { 'Authorization': authorization })
  }
}

function requireAuth(req: NextRequest): NextResponse | null {
  const authorization = req.headers.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  return null
}

// Risk calculation helper (simplified version for frontend)
function calculateRiskScore(waterTests: WaterTest[]): number {
  if (waterTests.length === 0) return 50

  let riskScore = 0
  let totalWeight = 0

  waterTests.forEach((test, index) => {
    const weight = Math.max(1, waterTests.length - index)
    totalWeight += weight

    switch (test.quality) {
      case 'good':
        riskScore += 20 * weight
        break
      case 'medium':
        riskScore += 60 * weight
        break
      case 'high':
        riskScore += 90 * weight
        break
      case 'disease':
        riskScore += 100 * weight
        break
      default:
        riskScore += 50 * weight
    }
  })

  const averageRisk = totalWeight > 0 ? riskScore / totalWeight : 50
  return Math.max(0, Math.min(100, Math.round(averageRisk)))
}

// Generate contamination history
function generateContaminationHistory(waterTests: WaterTest[]): ContaminationEvent[] {
  return waterTests
    .filter(test => ['medium', 'high', 'disease'].includes(test.quality))
    .slice(0, 10)
    .map(test => ({
      date: test.dateTime || test.date || new Date().toISOString(),
      quality: test.quality as 'medium' | 'high' | 'disease',
      location: test.location,
      notes: test.notes,
      severity: test.quality === 'disease' ? 'critical' : 
                test.quality === 'high' ? 'high' : 'medium'
    }))
}

// Generate QR code
async function generateQRCode(waterbodyId: string): Promise<string> {
  try {
    const healthCardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/health-card/${waterbodyId}`
    const qrCodeDataURL = await QRCode.toDataURL(healthCardUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

// GET /api/health-cards - Get all health cards
export async function GET(req: NextRequest) {
  const unauth = requireAuth(req)
  if (unauth) return unauth

  try {
    const res = await fetch(`${BACKEND_API_URL}/health-cards`, {
      headers: getAuthHeaders(req),
      cache: 'no-store',
    })

    if (!res.ok) {
      // Return demo data if backend is not available
      console.log('Backend not available, returning demo health cards')
      const demoHealthCards = [
        {
          id: '1',
          waterbodyName: 'Central Lake',
          waterbodyId: 'wb-001',
          location: 'City Center, Sector 1',
          latitude: 28.6139,
          longitude: 77.2090,
          riskScore: 75,
          lastTestedDate: new Date(Date.now() - 86400000).toISOString(),
          contaminationHistory: [
            {
              date: new Date(Date.now() - 172800000).toISOString(),
              quality: 'high',
              location: 'North shore',
              notes: 'High bacterial contamination detected',
              severity: 'high'
            }
          ],
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          createdAt: new Date(Date.now() - 604800000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          waterbodyName: 'Community Well #3',
          waterbodyId: 'wb-002',
          location: 'Residential Area, Sector 5',
          latitude: 28.7041,
          longitude: 77.1025,
          riskScore: 30,
          lastTestedDate: new Date(Date.now() - 43200000).toISOString(),
          contaminationHistory: [],
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          createdAt: new Date(Date.now() - 1209600000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      return NextResponse.json({
        healthCards: demoHealthCards,
        isDemo: true
      })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/health-cards failed:', err)
    return NextResponse.json(
      { error: 'Failed to fetch health cards' },
      { status: 500 }
    )
  }
}

// POST /api/health-cards - Create or update health card
export async function POST(req: NextRequest) {
  const unauth = requireAuth(req)
  if (unauth) return unauth

  try {
    const body = await req.json()
    const { waterbodyName, waterbodyId, location, latitude, longitude } = body

    if (!waterbodyName || !location) {
      return NextResponse.json(
        { error: 'waterbodyName and location are required' },
        { status: 400 }
      )
    }

    // Generate unique waterbody ID if not provided
    const finalWaterbodyId = waterbodyId || randomUUID()

    // Try to get water tests for this waterbody to calculate risk
    let waterTests: WaterTest[] = []
    try {
      const testsRes = await fetch(`${BACKEND_API_URL}/water-tests`, {
        headers: getAuthHeaders(req),
      })
      if (testsRes.ok) {
        const testsData = await testsRes.json()
        // Filter tests for this waterbody
        waterTests = (testsData.waterTests || testsData.data || [])
          .filter((test: WaterTest) => test.waterbodyName === waterbodyName)
          .slice(0, 20) // Last 20 tests for calculation
      }
    } catch {
      console.log('Could not fetch water tests for risk calculation')
    }

    // Calculate risk score and contamination history
    const riskScore = calculateRiskScore(waterTests)
    const contaminationHistory = generateContaminationHistory(waterTests)
    const lastTestedDate = waterTests.length > 0 ? waterTests[0].dateTime || waterTests[0].date : null

    // Generate QR code
    const qrCode = await generateQRCode(finalWaterbodyId)

    // Try to create on backend, fall back to demo response
    try {
      const res = await fetch(`${BACKEND_API_URL}/health-cards`, {
        method: 'POST',
        headers: getAuthHeaders(req),
        body: JSON.stringify({
          waterbodyName,
          waterbodyId: finalWaterbodyId,
          location,
          latitude: typeof latitude === 'number' ? latitude : null,
          longitude: typeof longitude === 'number' ? longitude : null,
          riskScore,
          lastTestedDate,
          contaminationHistory,
          qrCode
        }),
      })

      if (res.ok) {
        const data = await res.json()
        return NextResponse.json(data)
      }
    } catch {
      console.log('Backend not available, creating demo health card')
    }

    // Return demo response
    const healthCard = {
      id: `hc-${Date.now()}`,
      waterbodyName,
      waterbodyId: finalWaterbodyId,
      location,
      latitude: typeof latitude === 'number' ? latitude : null,
      longitude: typeof longitude === 'number' ? longitude : null,
      riskScore,
      lastTestedDate,
      contaminationHistory,
      qrCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      healthCard,
      isDemo: true
    })
  } catch (err) {
    console.error('POST /api/health-cards failed:', err)
    return NextResponse.json(
      { error: 'Failed to create health card' },
      { status: 500 }
    )
  }
}
