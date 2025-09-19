import { NextRequest, NextResponse } from 'next/server'

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

// PATCH /api/health-cards/[waterbodyId]/refresh - Refresh health card data
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ waterbodyId: string }> }
) {
  const unauth = requireAuth(req)
  if (unauth) return unauth

  const { waterbodyId } = await params

  try {
    const res = await fetch(`${BACKEND_API_URL}/health-cards/${waterbodyId}/refresh`, {
      method: 'PATCH',
      headers: getAuthHeaders(req),
    })

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: 'Health card not found' },
          { status: 404 }
        )
      }

      // Return demo refresh response
      const updatedHealthCard = {
        id: '1',
        waterbodyName: 'Demo Waterbody',
        waterbodyId: waterbodyId,
        location: 'Demo Location',
        latitude: 28.6139,
        longitude: 77.2090,
        riskScore: Math.floor(Math.random() * 100), // Random for demo
        lastTestedDate: new Date().toISOString(),
        contaminationHistory: [],
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        updatedAt: new Date().toISOString()
      }

      return NextResponse.json({
        healthCard: updatedHealthCard,
        isDemo: true
      })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(`PATCH /api/health-cards/${waterbodyId}/refresh failed:`, err)
    return NextResponse.json(
      { error: 'Failed to refresh health card' },
      { status: 500 }
    )
  }
}
