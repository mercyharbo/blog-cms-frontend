'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { contentService } from '@/services/content'
import {
  setContentTypes,
  setError,
  setLoading,
  setPosts,
  setPostTypeId,
} from '@/store/features/contentSlice'
import { ContentResponse, ContentType, Post } from '@/types/content'
import { format } from 'date-fns'
import Link from 'next/link'
import { useEffect } from 'react'
import { BiPlus } from 'react-icons/bi'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'
import PageLoadingSpinner from '../ui/PageLoadingSpinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

export default function PostListPage() {
  const dispatch = useAppDispatch()
  const { posts, loading, error, postTypeId } = useAppSelector(
    (state) => state.content
  )

  const getContentTypes = async () => {
    dispatch(setLoading(true))

    const { data, error } = (await contentService.getContentTypes()) as {
      data: { contentTypes: ContentType[] } | null
      error: string | null
    }

    if (error) {
      dispatch(setError(error))
      toast.error(error)
    } else if (data?.contentTypes) {
      dispatch(setContentTypes(data.contentTypes))

      const postType = data.contentTypes.find((type) => type.name === 'post')

      if (postType) {
        dispatch(setPostTypeId(postType.id))
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
      dispatch(setError(error))
      toast.error(error)
    } else if (data) {
      dispatch(setPosts(data.contents))
    }
    dispatch(setLoading(false))
  }

  const getContentPreview = (post: Post): string => {
    if (!post?.data?.content) return 'No content available'

    // Strip HTML tags and get plain text
    const plainText = post.data.content.replace(/<[^>]*>/g, '')
    return plainText.length > 100
      ? `${plainText.substring(0, 100)}...`
      : plainText
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
        <Link href='/dashboard/create-post'>
          <Button
            size={'lg'}
            variant={'default'}
            className='h-12 w-full cursor-pointer sm:w-auto'
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
                  <TableCell colSpan={5} className='h-24 text-center'>
                    No posts found
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className='flex flex-col gap-1'>
                        <span className='font-medium'>{post.data.title}</span>
                        <span className='text-sm text-muted-foreground'>
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
                        <Link href={`/dashboard/${post.id}`}>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-blue-600 hover:text-blue-700'
                          >
                            <FiEdit2 className='h-4 w-4' />
                          </Button>
                        </Link>
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
