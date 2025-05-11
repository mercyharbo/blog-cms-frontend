

// Image Interface
export interface Image {
  alt: string
  url: string
}

// Field Options Interface
export interface FieldOptions {
  source?: string
  maxLength?: number
  referenceType?: string
  hotspot?: boolean
  imageOptions?: {
    alt: boolean
    caption: boolean
    metadata?: boolean
  }
}

// Content Type Field Interface
export interface ContentTypeField {
  name: string
  type: string
  title: string
  required?: boolean
  options?: FieldOptions
}

// Post Data Interface
export interface PostData {
  title: string
  slug: string
  author: string
  content: string
  cover_image: Image
  meta_keywords: string[]
  meta_title: string
  reading_time: number
  tags: string[]
}

// Content Type Interface
export interface ContentType {
  id: string
  name: string
  title: string
  description: string | null
  fields: ContentTypeField[]
  created_at: string
  updated_at: string
  user_id: string
  userId: string | null
}

// Complete Post Type
export interface Post {
  id: string
  type_id: string
  user_id: string
  created_at: string
  updated_at: string
  published_at: string | null
  scheduled_at: string | null
  status: 'draft' | 'published' | 'scheduled'
  data: PostData
  content_type?: ContentType
}

// Response Interfaces
export interface ContentResponse {
  status: boolean
  message: string
  content: Post
}

export interface ContentListResponse {
  status: boolean
  message: string
  contents: Post[]
}

// Content Types Response Interface
export interface ContentTypesResponse {
  contentTypes: ContentType[]
}

// Generic API Response Interface
export interface ApiResponse<T> {
  status: boolean
  message: string
  content?: T
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

// Content State Interface
export interface ContentState {
  currentPost: Post | null
  posts: Post[]
  loading: boolean
  error: string | null
  postTypeId: string | null
}
