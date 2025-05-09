import { UserProfile } from '@/types/auth'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
let isRedirecting = false

interface RequestOptions extends RequestInit {
  requireAuth?: boolean
}

interface ApiResponse<T = unknown, U = UserProfile> {
  message?: string
  error?: string
  user?: U
  data?: T
  session?: {
    access_token: string
    expires_in: number
    expires_at: number
  }
}

export async function fetchApi<
  T extends ApiResponse<D, U>,
  D = unknown,
  U = UserProfile
>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requireAuth = false, ...fetchOptions } = options
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${baseUrl}${endpoint}`

  if (requireAuth) {
    const token = cookies.get('access_token')
    if (!token) {
      if (!isRedirecting) {
        isRedirecting = true
        cookies.remove('access_token')
        window.location.href = '/'
      }
      throw new Error('No auth token')
    }
    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...fetchOptions.headers,
    },
  })

  const data = await res.json()

  // Handle all 400-level status codes by removing token and redirecting
  if (res.status >= 400 && res.status < 500) {
    if (!isRedirecting) {
      isRedirecting = true
      cookies.remove('access_token')
      window.location.href = '/'
    }
    throw new Error(data.error || `Request failed with status ${res.status}`)
  }

  if (!res.ok) {
    throw new Error(data.error || 'API request failed')
  }

  return data as T
}
