'use client'

import { contentService } from '@/services/content'
import { Post, isRichTextPost } from '@/types/content'
import { format } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import PageLoadingSpinner from '../ui/PageLoadingSpinner'

interface ContentType {
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

interface ContentResponse {
  contents: Post[]
}

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])

  const getContentTypes = async () => {
    setLoading(true)

    const { data, error } = (await contentService.getContentTypes()) as {
      data: { contentTypes: ContentType[] } | null
      error: string | null
    }

    if (error) {
      toast.error(error)
    } else if (data?.contentTypes) {
      setContentTypes(data.contentTypes)

      const postType = data.contentTypes.find((type) => type.name === 'post')

      if (postType) {
        getContents(postType.id)
      }
    }
  }

  const getContents = async (contentTypeId: string) => {
    const { data, error } = (await contentService.getContent(
      contentTypeId
    )) as {
      data: ContentResponse | null
      error: string | null
    }

    if (error) {
      toast.error(error)
      setError(error)
    } else if (data) {
      setPosts(data.contents)
    }
    setLoading(false)
  }

  const getContentPreview = (post: Post): string => {
    if (isRichTextPost(post)) {
      // For rich text content, we'll just show a placeholder for now
      // You can enhance this later when rich text editor is implemented
      return 'Rich text content...'
    } else {
      // For plain text, show first 100 characters
      return post.data.content.substring(0, 100) + '...'
    }
  }

  useEffect(() => {
    getContentTypes()
  }, [])

  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <main className='min-h-screen flex flex-col gap-5 p-4 md:p-6'>
      {/* Header */}
      <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h1 className='text-2xl font-semibold'>My Blog Posts</h1>
        <Link href='/create-post'>
          <Button
            size={'lg'}
            variant={'default'}
            className='h-12 w-full sm:w-auto'
          >
            <BiPlus /> New Post
          </Button>
        </Link>
      </header>

      {/* Table container with Tailwind utilities */}
      <div className='w-full border rounded-md'>
        <div className='scrollbar-hide w-full overflow-x-auto'>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className='min-w-[200px]'>Title</TableHead>
                <TableHead className='min-w-[100px]'>Author</TableHead>
                <TableHead className='min-w-[120px]'>Last Updated</TableHead>
                <TableHead className='min-w-[100px] text-right'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className='text-center py-4'>
                    No posts found
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className='font-medium'>
                      <div className='flex flex-col gap-1 max-w-[300px]'>
                        <h2 className='truncate'>{post.data.title}</h2>
                        <span className='text-sm text-gray-500 line-clamp-2'>
                          {getContentPreview(post)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>
                      {post.data.author || 'John Doe'}
                    </TableCell>
                    <TableCell className='whitespace-nowrap'>
                      {format(new Date(post.updated_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className='text-right whitespace-nowrap'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-blue-600 hover:text-blue-700'
                        >
                          <FiEdit2 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:text-red-700'
                        >
                          <FiTrash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
}
