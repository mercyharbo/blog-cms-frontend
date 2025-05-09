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
  setPostTypeId,
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
  const { posts, loading, postTypeId } = useAppSelector(
    (state) => state.content
  )
  const [postToDelete, setPostToDelete] = useState<{
    id: string
    title: string
    postTypeId: string
  } | null>(null)

  /**
   * The function `contentTypeReq` fetches content types, handles errors, and dispatches actions based on
   * the retrieved data.
   */
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

  /**
   * The function `getPostContents` fetches post contents based on a content type ID and handles errors
   * accordingly.
   * @param {string} contentTypeId - The `contentTypeId` parameter in the `getPostContents` function is a
   * string that represents the type of content to be fetched. It is used to retrieve content data based
   * on the specified content type.
   */
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

  const handleDeleteModal = (post: Post) => {
    setPostToDelete({
      id: post.id,
      title: post.data.title,
      postTypeId: postTypeId ?? '',
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
  const deleteContentFunc = async (contentTypeId: string, postId: string) => {
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

      <div className='hide-scrollbar overflow-x-auto w-full border rounded-md'>
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
                        <Button type='button' variant='outline' size='sm'>
                          <FiEdit2 className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
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
