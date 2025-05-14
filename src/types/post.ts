import { ContentTypeField, Image } from './content'

export interface PostData {
  title: string
  slug: string
  author: string
  content: string
  status: 'draft' | 'published' | 'scheduled'
  scheduled_at?: string | null
  cover_image: Image
  tags: string[]
  meta_title: string
  meta_keywords: string[]
  reading_time: number
}

// Regular post type (for list view)
export interface Post {
  id: string
  type_id: string
  user_id: string
  title: string
  slug: string
  author: string
  content: string
  status: 'draft' | 'published' | 'scheduled'
  scheduled_at: string | null
  published_at: string | null
  cover_image: Image
  tags: string[]
  meta_title: string
  meta_keywords: string[]
  reading_time: number
  created_at: string
  updated_at: string
}

// Single post type with nested data
export interface SinglePost {
  id: string
  type_id: string
  user_id: string
  content_type: {
    id: string
    name: string
    title: string
    fields: ContentTypeField[]
    description: string | null
  }
  status: 'draft' | 'published' | 'scheduled'
  scheduled_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  data: PostData
}

// Note: CreatePostData type is now defined via Zod schema in PostForm.tsx

export interface PostFormProps {
  initialData?: Post | SinglePost
  contentTypeId?: string
  isEditing?: boolean
  onSuccess?: () => void
}
