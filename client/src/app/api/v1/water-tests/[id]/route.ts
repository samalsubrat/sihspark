import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = 'http://sihspark.onrender.com/api/v1'

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

// PATCH /api/v1/water-tests/:id (owner ASHA or admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await request.json()
    
    // Forward to backend API
    const response = await fetch(`${BACKEND_API_URL}/water-tests/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(request),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Error updating water test:', error)
    return NextResponse.json(
      { error: 'Failed to update water test' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/water-tests/:id (owner ASHA or admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Forward to backend API
    const response = await fetch(`${BACKEND_API_URL}/water-tests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(request),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Error deleting water test:', error)
    return NextResponse.json(
      { error: 'Failed to delete water test' },
      { status: 500 }
    )
  }
}
