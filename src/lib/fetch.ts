type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface FetchOptions {
  method?: RequestMethod
  // Replace 'any' with a more specific type
  body?: Record<string, unknown> | string | FormData | null
  headers?: HeadersInit
  cache?: RequestCache
  revalidate?: number
  requireAuth?: boolean
}

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const {
    method = 'GET',
    body,
    headers = {},
    requireAuth = false,
    ...restOptions
  } = options

  try {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    }

    // Add auth token if required
    if (requireAuth) {
      const token = getCookie('access_token')
      if (!token) {
        throw new Error('Authentication required')
      }
      requestHeaders.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      ...restOptions,
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong')
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Something went wrong',
    }
  }
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null
  return null
}
