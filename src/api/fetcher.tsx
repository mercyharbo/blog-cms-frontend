import Cookies from 'universal-cookie'

const cookiesStore = new Cookies()

export const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

// Custom error class (assumed already defined)
class FetchError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export const fetcherWithAuth = async ([url, options]: [
  string,
  { headers?: Record<string, string> }
]) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    if (res.status === 401) {
      // Clear access token and redirect
      cookiesStore.remove('access_token')
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
      throw new FetchError('Unauthorized access', 401)
    }

    const errorData = await res.json()
    throw new FetchError(
      errorData.message || 'Failed to fetch documents',
      res.status
    )
  }

  return res.json()
}
