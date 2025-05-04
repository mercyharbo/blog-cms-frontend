import { fetchApi } from '@/lib/fetch'
import { ContentResponse } from '@/types/content'

// Add interface for post data
interface CreatePostData {
  title: string
  slug: string
  author: string
  content: string
  status: 'draft' | 'published'
  featuredImage?: string
  tags: string[]
  publishedAt: string
  metaDescription: string
}

export const contentService = {
  getContentTypes: async () => {
    return fetchApi('/api/content/types', {
      method: 'GET',
      requireAuth: true,
    })
  },
  getContent: (contentTypeId: string) =>
    fetchApi<ContentResponse>(`/api/content/${contentTypeId}`, {
      method: 'GET',
      requireAuth: true,
    }),
  getContentDetails: (contentTypeId: string, postId: string) =>
    fetchApi<ContentResponse>(`/api/content/${contentTypeId}/${postId}`, {
      method: 'GET',
      requireAuth: true,
    }),
  createContent: (contentTypeId: string, postData: CreatePostData) =>
    fetchApi<ContentResponse>(`/api/content/${contentTypeId}`, {
      method: 'POST',
      requireAuth: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: postData,
    }),
}
