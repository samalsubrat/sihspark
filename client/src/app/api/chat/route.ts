import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: "user" | "model"
  parts: string[]
}

interface ChatRequest {
  message: string
  language: string
  history: ChatMessage[]
}

interface ChatResponse {
  response: string
  history: ChatMessage[]
  selected_language: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    
    // Forward the request to your backend chatbot API
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: body.message,
        language: body.language,
        history: body.history
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data: ChatResponse = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Parse request body again for fallback
    let fallbackBody: ChatRequest
    try {
      const requestClone = request.clone()
      fallbackBody = await requestClone.json()
    } catch {
      fallbackBody = { message: "", language: "English", history: [] }
    }
    
    // Return a fallback response in case of error
    return NextResponse.json(
      {
        response: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        history: [
          ...(fallbackBody.history || []),
          {
            role: "user",
            parts: [fallbackBody.message || ""]
          },
          {
            role: "model", 
            parts: ["I'm sorry, I'm having trouble connecting right now. Please try again later."]
          }
        ],
        selected_language: fallbackBody.language || "English"
      } as ChatResponse,
      { status: 500 }
    )
  }
}
