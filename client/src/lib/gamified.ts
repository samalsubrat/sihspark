interface Playbook {
  id: string
  title: string
  content: string
  source?: 'local' | 'llm'
  createdAt: string
  updatedAt: string
}

interface Story {
  id: string
  title: string
  content: string
  source?: 'local' | 'llm'
  createdAt: string
  updatedAt: string
}

interface Testimonial {
  id: string
  content: string
  authorName?: string
  createdAt: string
  updatedAt: string
}

interface CreatePlaybookPayload {
  title: string
  content: string
  source?: 'local' | 'llm'
}

interface UpdatePlaybookPayload {
  title?: string
  content?: string
  source?: 'local' | 'llm'
}

interface CreateStoryPayload {
  title: string
  content: string
  source?: 'local' | 'llm'
}

interface UpdateStoryPayload {
  title?: string
  content?: string
  source?: 'local' | 'llm'
}

interface CreateTestimonialPayload {
  content: string
  authorName?: string
}

interface UpdateTestimonialPayload {
  content?: string
  authorName?: string
}

interface PlaybooksResponse {
  playbooks: Playbook[]
}

interface StoriesResponse {
  stories: Story[]
}

interface TestimonialsResponse {
  testimonials: Testimonial[]
}

interface CreatePlaybookResponse {
  playbook: { id: string }
}

interface CreateStoryResponse {
  story: { id: string }
}

interface CreateTestimonialResponse {
  testimonial: { id: string }
}

interface UpdatePlaybookResponse {
  playbook: { id: string }
}

interface UpdateStoryResponse {
  story: { id: string }
}

interface UpdateTestimonialResponse {
  testimonial: { id: string }
}

interface DeleteResponse {
  deleted: boolean
}

const API_BASE_URL = 'https://sihspark.onrender.com/api/v1'

export class GamifiedService {
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private static getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  // Playbooks API
  static async getPlaybooks(): Promise<PlaybooksResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/playbooks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch playbooks'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async createPlaybook(payload: CreatePlaybookPayload): Promise<CreatePlaybookResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/playbooks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to create playbook'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async updatePlaybook(id: string, payload: UpdatePlaybookPayload): Promise<UpdatePlaybookResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/playbooks/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to update playbook'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async deletePlaybook(id: string): Promise<DeleteResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/playbooks/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to delete playbook'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  // Stories API
  static async getStories(): Promise<StoriesResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/stories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch stories'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async createStory(payload: CreateStoryPayload): Promise<CreateStoryResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/stories`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to create story'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async updateStory(id: string, payload: UpdateStoryPayload): Promise<UpdateStoryResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/stories/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to update story'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async deleteStory(id: string): Promise<DeleteResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/stories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to delete story'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  // Testimonials API
  static async getTestimonials(): Promise<TestimonialsResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/testimonials`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      let errorMessage = 'Failed to fetch testimonials'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async createTestimonial(payload: CreateTestimonialPayload): Promise<CreateTestimonialResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/testimonials`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to create testimonial'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async updateTestimonial(id: string, payload: UpdateTestimonialPayload): Promise<UpdateTestimonialResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/testimonials/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to update testimonial'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  static async deleteTestimonial(id: string): Promise<DeleteResponse> {
    const response = await fetch(`${API_BASE_URL}/gamified/testimonials/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to delete testimonial'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `${response.status} ${response.statusText}` || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }
}

export type {
  Playbook,
  Story,
  Testimonial,
  CreatePlaybookPayload,
  UpdatePlaybookPayload,
  CreateStoryPayload,
  UpdateStoryPayload,
  CreateTestimonialPayload,
  UpdateTestimonialPayload,
  PlaybooksResponse,
  StoriesResponse,
  TestimonialsResponse
}
