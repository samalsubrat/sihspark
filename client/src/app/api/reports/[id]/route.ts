import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL =
  'https://sihspark.onrender.com/api/v1'

function getAuthHeaders(req: NextRequest) {
  let auth = req.headers.get('authorization')
  if (!auth) {
    const cookieToken = req.cookies.get('auth_token')?.value
    if (cookieToken) auth = `Bearer ${cookieToken}`
  }
  return {
    'Content-Type': 'application/json',
    ...(auth ? { Authorization: auth } : {}),
  }
}

function requireAuth(req: NextRequest) {
  let auth = req.headers.get('authorization')
  if (!auth) {
    const cookieToken = req.cookies.get('auth_token')?.value
    if (cookieToken) auth = `Bearer ${cookieToken}`
  }
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  return null
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = requireAuth(req)
  if (unauth) return unauth

  const { id } = await params
  try {
    const body = await req.json()
    const res = await fetch(`${BACKEND_API_URL}/reports/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(req),
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      let message = `Backend error ${res.status}`
      try {
        const data = await res.json()
        message = data?.message || message
      } catch {}
      return NextResponse.json({ error: message }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(`PATCH /api/reports/${id} proxy failed:`, err)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 502 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = requireAuth(req)
  if (unauth) return unauth

  const { id } = await params
  try {
    const res = await fetch(`${BACKEND_API_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(req),
    })

    if (!res.ok) {
      let message = `Backend error ${res.status}`
      try {
        const data = await res.json()
        message = data?.message || message
      } catch {}
      return NextResponse.json({ error: message }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(`DELETE /api/reports/${id} proxy failed:`, err)
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 502 })
  }
}
