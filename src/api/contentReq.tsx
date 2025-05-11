import Cookies from 'universal-cookie'

export async function getContentTypes() {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')
  // Build the URL based on type parameter
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/content/types`)

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  })

  const response = await res.json()

  if (!res.ok) {
    throw new Error(response.message || 'Failed to fetch content types')
  }

  return response
}

export async function updateContentType(
  contentTypeId: string,
  payload: {
    title: string
    slug: string
    description: string
  }
) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/types/${contentTypeId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    }
  )

  const response = await res.json()

  if (!res.ok) {
    throw new Error(response.message || 'Failed to update content types')
  }

  return response
}

export async function getContent(contentTypeId?: string) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/content`
  const url = contentTypeId ? `${baseUrl}/${contentTypeId}` : baseUrl

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  })

  const response = await res.json()

  if (!res.ok) {
    throw new Error(response.message || 'Failed to fetch content')
  }

  return response
}

export async function getContentDetails(postId: string) {
  try {
    const cookie_store = new Cookies()
    const access_token = cookie_store.get('access_token')

    if (!access_token) {
      return { status: false, message: 'Authentication required' }
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/content/${postId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    const apiResponse = await res.json()

    if (!res.ok) {
      return {
        status: false,
        message: apiResponse.message || 'Failed to fetch content details',
      }
    }

    return apiResponse
  } catch (error) {
    console.error('Error in getContentDetails:', error)
    return {
      status: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

export async function createContentType(payload: {
  title: string
  slug: string
  description: string
}) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/types`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message)
  }

  return data
}

interface ImageType {
  url: string
  alt: string
}

export async function createContent(
  contentTypeId: string,
  postData: {
    title: string
    slug: string
    author: string
    content: string
    cover_image: ImageType
    reading_time: number
    tags: string[]
    meta_title: string
    meta_keywords: string[]
    status?: 'draft' | 'published' | 'scheduled'
    scheduled_at?: string | null
  }
) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/types/${contentTypeId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(postData),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message)
  }

  return { data }
}

export async function updateContent(
  id: string,
  postData: {
    title: string
    slug: string
    author: string
    content: string
    status: 'draft' | 'published' | 'scheduled'
    scheduled_at?: string | null
    cover_image: ImageType
    tags: string[]
    meta_title: string
    meta_keywords: string[]
    reading_time: number
  }
) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(postData),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update content')
  }

  return { data }
}

export async function deleteContent(postId: string) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/types/${postId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete content')
  }

  return { data }
}
