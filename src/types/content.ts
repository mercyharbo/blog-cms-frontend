import { PortableTextBlock } from '@portabletext/types'

// Base Content Interface
interface BaseContent {
  id: string
  type_id: string
  created_at: string
  updated_at: string
}

// Post Data Interface
export interface PostData {
  title: string
  slug: string
  author: string
  content: PortableTextBlock[] | string
  status: 'draft' | 'published'
  featuredImage: string
  tags: string[]
  publishedAt: string
  metaDescription: string
}

// Complete Post Type
export interface Post extends BaseContent {
  data: PostData
}

// Response Interfaces
export interface ContentResponse {
  contents: Post[]
}

export interface ContentDetailsResponse {
  content: Post
}

// Content Type Interface
export interface ContentType {
  id: string
  name: string
  title: string
  fields: Array<{
    name: string
    type: string
    title: string
    required?: boolean
    options?: any
  }>
  created_at: string
}

// Content Store Interface
export interface ContentStore {
  contentTypes: ContentType[]
  loading: boolean
  error: string | null
  postTypeId: string | null
  fetchContentTypes: () => Promise<void>
  setError: (error: string | null) => void
  reset: () => void
}
