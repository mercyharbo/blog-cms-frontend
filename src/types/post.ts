export interface CreatePostData {
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

export interface PostFormProps {
  initialData?: Partial<CreatePostData>
  onSubmit: (data: CreatePostData) => Promise<void>
}
