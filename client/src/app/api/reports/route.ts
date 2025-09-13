import { NextRequest, NextResponse } from 'next/server'

// Read backend base URL from env with sane defaults
const BACKEND_API_URL =
  'https://sihspark.onrender.com/api/v1'

function getAuthHeaders(req: NextRequest) {
	let auth = req.headers.get('authorization')
	// Fallback to cookie if header missing
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

// GET /api/reports -> proxy to backend
export async function GET(req: NextRequest) {
	const unauth = requireAuth(req)
	if (unauth) return unauth

	try {
		const res = await fetch(`${BACKEND_API_URL}/reports`, {
			headers: getAuthHeaders(req),
			// Force no-cache to always reflect latest DB state
			cache: 'no-store',
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
		console.error('GET /api/reports proxy failed:', err)
		return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 502 })
	}
}

// POST /api/reports -> proxy to backend
export async function POST(req: NextRequest) {
	const unauth = requireAuth(req)
	if (unauth) return unauth

	try {
		const body = await req.json()
		const res = await fetch(`${BACKEND_API_URL}/reports`, {
			method: 'POST',
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
		console.error('POST /api/reports proxy failed:', err)
		return NextResponse.json({ error: 'Failed to create report' }, { status: 502 })
	}
}

