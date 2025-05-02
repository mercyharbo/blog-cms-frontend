// Rich Text Types
interface RichTextContent {
  type: 'doc'
  content: Array<any>
}

// Common Content Fields
interface BaseContent {
  id: string
  type_id: string
  created_at: string
  updated_at: string
}

// First Content Structure (Rich Text)
interface RichTextPost extends BaseContent {
  data: {
    title: string
    slug: string
    author: string
    mainImage: string
    categories: string[]
    publishedAt: string
    body: RichTextContent
  }
}

// Second Content Structure (Plain Text)
interface PlainTextPost extends BaseContent {
  data: {
    title: string
    slug: string
    author: string
    content: string
    featuredImage: string
    metaDescription: string
    publishedAt: string
    status: 'draft' | 'published'
    tags: string[]
  }
}

export type Post = RichTextPost | PlainTextPost

export function isRichTextPost(post: Post): post is RichTextPost {
  return 'body' in post.data
}

export interface ContentResponse {
  contents: Post[]
}
