import { Image } from './content'

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

export interface CreatePostData {
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

export interface PostFormProps {
  initialData?: Post
  contentTypeId?: string
  isEditing?: boolean
  onSuccess?: () => void
}
