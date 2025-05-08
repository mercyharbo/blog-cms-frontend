// Base Content Interface
interface BaseContent {
  id: string
  type_id: string
  user_id: string
  created_at: string
  updated_at: string
  last_modified: string
}

// Image Interface
export interface Image {
  alt: string
  url: string
}

// Post Data Interface
export interface PostData {
  title: string
  slug: string
  author: string
  content: string
  status: 'draft' | 'published'
  cover_image: Image
  social_image: Image
  tags: string[]
  meta_title: string
  meta_keywords: string[]
  reading_time: number
}

// Complete Post Type
export interface Post extends BaseContent {
  content_type_id: string
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
    imageOptions?: {
      alt: boolean
      caption: boolean
      metadata?: boolean // Add if needed
    }
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

export interface ContentState {
  currentPost: Post | null
  posts: Post[]
  loading: boolean
  error: string | null
  postTypeId: string | null
}
