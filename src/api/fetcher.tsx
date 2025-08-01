export const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

// export const fetcherWithAuth = async (url: string) => {
//   return fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//   }).then((res) => res.json())
// }

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
      throw new FetchError('Unauthorized access', res.status)
    }
    const errorData = await res.json()
    throw new FetchError(
      errorData.message || 'Failed to fetch documents',
      res.status
    )
  }

  return res.json()
}
