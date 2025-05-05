'use client'

import { getContent, getContentTypes } from '@/api/contentReq'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  setContentTypes,
  setError,
  setLoading,
  setPosts,
  setPostTypeId,
} from '@/store/features/contentSlice'
import { ContentType, Post } from '@/types/content'
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

interface TextNode {
  text: string
}

interface ContentBlock {
  children?: TextNode[]
}

export default function PostListPage() {
  const dispatch = useAppDispatch()
  const { posts, loading } = useAppSelector((state) => state.content)

  const contentTypeReq = async () => {
    dispatch(setLoading(true))

    try {
      const data = await getContentTypes()

      if (data?.data?.error) {
        dispatch(setError(data.data.error))
        toast.error(data.data.error)
      } else if (data?.data?.contentTypes) {
        dispatch(setContentTypes(data.data.contentTypes))

        const postType: ContentType | undefined = data.data.contentTypes.find(
          (type: ContentType) => type.name === 'post'
        )

        if (postType) {
          dispatch(setPostTypeId(postType.id))
          getPostContents(postType.id)
        }
      }
    } catch (error) {
      let errorMsg = 'An error occurred while fetching content types'
      if (error instanceof Error) {
        errorMsg = error.message
      } else if (typeof error === 'string') {
        errorMsg = error
      }
      dispatch(setError(errorMsg))
      toast.error(errorMsg)
    }
  }

  const getPostContents = async (contentTypeId: string) => {
    try {
      const data = await getContent(contentTypeId)

      if (data.data.error) {
        dispatch(setError(data.data.error))
        toast.error(data.data.error)
      } else if (data) {
        dispatch(setPosts(data.data.contents))
      }
      dispatch(setLoading(false))
    } catch (error) {
      let errorMsg = 'An error occurred while fetching content'
      if (error instanceof Error) {
        errorMsg = error.message
      } else if (typeof error === 'string') {
        errorMsg = error
      }
      dispatch(setError(errorMsg))
      toast.error(errorMsg)
    }
  }

  const getContentPreview = (post: Post): string => {
    if (!post?.data?.content) return 'No content available'

    // Strip HTML tags and get plain text
    const content = post.data.content

    const plainText: string =
      typeof content === 'string'
        ? content.replace(/<[^>]*>/g, '')
        : (content as ContentBlock[])
            .map((block) =>
              block.children?.map((child) => child.text).join(' ')
            )
            .join(' ')
    return plainText.length > 100
      ? `${plainText.substring(0, 100)}...`
      : plainText
  }

  useEffect(() => {
    contentTypeReq()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <main className='flex flex-col gap-5 space-y-10 w-full'>
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

      <div className='overflow-x-auto scrollbar-hide w-full border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[40%]'>Title</TableHead>
              <TableHead className='w-[20%]'>Author</TableHead>
              <TableHead className='w-[20%]'>Last Updated</TableHead>
              <TableHead className='w-[20%] text-right'>Actions</TableHead>
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
                      <span className='font-medium truncate'>
                        {post.data.title}
                      </span>
                      <span className='text-sm text-muted-foreground truncate'>
                        {getContentPreview(post)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='truncate'>
                      {post.data.author || 'John Doe'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='truncate'>
                      {format(new Date(post.updated_at), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
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
    </main>
  )
}
