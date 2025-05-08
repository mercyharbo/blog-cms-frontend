import { Image } from './content'

export interface CreatePostData {
  title: string
  slug: string
  author: string
  content: string
  status: 'draft' | 'published'
  cover_image: Image
  tags: string[]
  meta_title: string
  meta_keywords: string[]
  reading_time: number
}

export interface PostFormProps {
  initialData?: {
    id: string
    type_id: string
    user_id: string
    created_at: string
    updated_at: string
    last_modified: string
    data: CreatePostData
  }
  contentTypeId?: string
  isEditing?: boolean
  onSuccess?: () => void
}
