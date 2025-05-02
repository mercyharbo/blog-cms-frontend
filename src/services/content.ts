import { fetchApi } from '@/lib/fetch'
import { ContentResponse } from '@/types/content'

export const contentService = {
  getContentTypes: async () => {
    return fetchApi('/api/content/types', {
      method: 'GET',
      requireAuth: true,
    })
  },
  getContent: (contentTypeId: string) =>
    fetchApi<ContentResponse>(`/api/content/${contentTypeId}`, {
      requireAuth: true,
    }),
}
