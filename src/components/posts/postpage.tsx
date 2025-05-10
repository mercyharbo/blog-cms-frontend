'use client'

import { deleteContent, getContent, getContentTypes } from '@/api/contentReq'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  setContentTypes,
  setError,
  setLoading,
  setPosts,
} from '@/store/features/contentSlice'
import { ContentType, Post } from '@/types/content'
import { format } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  const { posts, loading, contentTypes } = useAppSelector(
    (state) => state.content
  )
  const [selectedContentType, setSelectedContentType] =
    useState<ContentType | null>(null)
  const [postToDelete, setPostToDelete] = useState<{
    id: string
    title: string
    postTypeId: string
  } | null>(null)
  const contentTypeReq = async () => {
    dispatch(setLoading(true))

    try {
      const data = await getContentTypes()

      if (data?.data?.error) {
        dispatch(setError(data.data.error))
        toast.error(data.data.error)
      } else if (data?.data?.contentTypes) {
        // First store all content types for the dropdown
        dispatch(setContentTypes(data.data.contentTypes))

        // Load all contents by default without selecting any content type
        await getPostContents()
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
    } finally {
      dispatch(setLoading(false))
    }
  }
  const getPostContents = async (contentTypeId?: string) => {
    try {
      const data = await getContent(contentTypeId)

      if (data.data.error) {
        dispatch(setError(data.data.error))
        toast.error(data.data.error)
      } else if (data) {
        dispatch(setPosts(data.data.contents))
      }
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
  const handleDeleteModal = (post: Post) => {
    setPostToDelete({
      id: post.id,
      title: post.data.title,
      postTypeId: selectedContentType?.id ?? '',
    })
  }

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      try {
        await deleteContentFunc(postToDelete.postTypeId, postToDelete.id)
        setPostToDelete(null)

        // Fetch posts again after successful deletion
        setTimeout(() => {
          window.location.reload()
        }, 5000)
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  /**
   * The function `deleteContentFunc` is an asynchronous function that handles the deletion of content
   * based on the content type and post ID, displaying success or error messages and updating the post
   * list accordingly.
   * @param {string} contentTypeId - The `contentTypeId` parameter in the `deleteContentFunc` function
   * is a string that represents the type of content being deleted. It is used to identify the specific
   * type of content that is being deleted, such as a post, comment, or any other type of content in the
   * system.
   * @param {string} postId - The `postId` parameter in the `deleteContentFunc` function is the unique
   * identifier of the post that you want to delete. It is used to specify which post should be deleted
   * when calling the `deleteContent` function.
   */
  const deleteContentFunc = async (
    contentTypeId: string | undefined,
    postId: string
  ) => {
    try {
      dispatch(setLoading(true))
      const data = await deleteContent(contentTypeId, postId)

      if (data.data.error) {
        dispatch(setError(data.data.error))
        toast.error(data.data.error)
      } else if (data) {
        toast.success(data.data.message)
      }
    } catch (error) {
      let errorMsg = 'An error occurred while deleting content'
      if (error instanceof Error) {
        errorMsg = error.message
      } else if (typeof error === 'string') {
        errorMsg = error
      }
      dispatch(setError(errorMsg))
      toast.error(errorMsg)
    } finally {
      dispatch(setLoading(false))
    }
  }

  /**
   * The function `getContentPreview` takes a post object as input and returns a preview of its content
   * by stripping HTML tags and limiting the length to 100 characters.
   * @param {Post} post - The `post` parameter in the `getContentPreview` function is expected to be an
   * object of type `Post`. It is used to extract the content data from the post in order to generate a
   * preview. If the post object or its content data is missing or empty, the function will return 'No
   * @returns The `getContentPreview` function returns a preview of the content from a post. If the post
   * data does not contain any content, it returns 'No content available'. If there is content available,
   * it strips HTML tags and gets the plain text. If the plain text is longer than 100 characters, it
   * returns the first 100 characters followed by '...'. Otherwise, it returns the entire plain text
   */
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
  const handleContentTypeChange = async (contentType: ContentType | null) => {
    setSelectedContentType(contentType)
    dispatch(setLoading(true))
    try {
      await getPostContents(contentType?.id)
    } finally {
      dispatch(setLoading(false))
    }
  }
  useEffect(() => {
    contentTypeReq()
  }, []) // Only run once on mount

  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <main className='container mx-auto py-10 space-y-6'>
      <header className='flex flex-col items-start lg:flex-row md:flex-row md:justify-between md:items-center lg:justify-between lg:items-center w-full gap-5 sm:gap-8'>
        <h1 className='text-2xl font-bold'>Posts</h1>
        <div className='flex flex-col items-start lg:flex-row lg:items-center gap-4 w-full lg:w-auto md:w-auto md:flex-row'>
          <div className='flex flex-col w-full lg:w-auto lg:flex-row md:w-auto md:flex-row md:items-center items-start lg:items-center gap-3'>
            <label className='text-sm text-gray-500 font-medium'>
              Filter by type:
            </label>
            <select
              value={selectedContentType?.id || ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  handleContentTypeChange(null)
                } else {
                  const selected = contentTypes.find(
                    (ct) => ct.id === e.target.value
                  )
                  if (selected) {
                    handleContentTypeChange(selected)
                  }
                }
              }}
              className='border rounded-md w-full lg:w-auto md:w-auto px-3 py-2 h-12 text-sm bg-transparent text-black dark:bg-black dark:text-white focus:ring-2 focus:ring-primary/20'
            >
              <option value=''>All Content</option>
              {contentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/dashboard/create-post${
              selectedContentType ? `?type=${selectedContentType.id}` : ''
            }`}
            className='w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-md transition-colors'
          >
            <BiPlus className='w-5 h-5' />
            Create Post
          </Link>
        </div>
      </header>{' '}
      <div className='hide-scrollbar overflow-x-auto w-full border rounded-md bg-white dark:bg-black'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-full sm:w-[40%] min-w-[200px]'>
                Title
              </TableHead>
              <TableHead className='hidden sm:table-cell w-[20%]'>
                Author
              </TableHead>
              <TableHead className='hidden md:table-cell w-[20%]'>
                Last Updated
              </TableHead>
              <TableHead className='w-[120px] sm:w-[20%] text-right'>
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
                  {' '}
                  <TableCell>
                    <div className='flex flex-col gap-1 min-w-[200px]'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3'>
                        <span className='font-medium truncate'>
                          {post.data.title}
                        </span>
                        <span className='text-xs text-muted-foreground sm:hidden'>
                          by {post.data.author || 'John Doe'} •{' '}
                          {format(new Date(post.updated_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <span className='text-sm text-muted-foreground truncate'>
                        {getContentPreview(post)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <span className='truncate'>
                      {post.data.author || 'John Doe'}
                    </span>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <span className='truncate'>
                      {format(new Date(post.updated_at), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link href={`/dashboard/${post.id}`}>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          className='h-9 w-9 p-0'
                        >
                          <FiEdit2 className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='h-9 w-9 p-0'
                        onClick={() => handleDeleteModal(post)}
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
      <Dialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{postToDelete?.title}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setPostToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={() => handleConfirmDelete()}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
