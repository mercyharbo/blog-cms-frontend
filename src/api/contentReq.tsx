import Cookies from 'universal-cookie'

export async function getContentTypes() {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/types`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch content types')
  }

  return { data }
}

export async function getContent(contentTypeId: string) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/${contentTypeId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch content')
  }

  return { data }
}

export async function getContentDetails(contentTypeId: string, postId: string) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/${contentTypeId}/${postId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch content details')
  }

  return { data }
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
    status: 'draft' | 'published'
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/${contentTypeId}`,
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
    throw new Error(data.error || 'Failed to create content')
  }

  return { data }
}

export async function updateContent(
  contentTypeId: string,
  slug: string,
  postData: {
    title: string
    slug: string
    author: string
    content: string
    status: 'draft' | 'published'
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/${contentTypeId}/${slug}`,
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
    throw new Error(data.error || 'Failed to update content')
  }

  return { data }
}

export async function deleteContent(contentTypeId: string, postId: string) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/${contentTypeId}/${postId}`,
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
    throw new Error(data.error || 'Failed to delete content')
  }

  return { data }
}
