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
  content: string
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

// Content Type Field Interface
export interface ContentTypeField {
  name: string
  type: string
  title: string
  required?: boolean
  options?: {
    source?: string
    maxLength?: number
    referenceType?: string
    hotspot?: boolean
  }
}

// Content Type Interface
export interface ContentType {
  id: string
  name: string
  title: string
  fields: ContentTypeField[]
  created_at: string
  updated_at: string
}

// Content Types Response Interface
export interface ContentTypesResponse {
  contentTypes: ContentType[]
}

export interface ContentType {
  id: string
  name: string
}

export interface ApiResponse<T> {
  data: T
  error?: string
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
