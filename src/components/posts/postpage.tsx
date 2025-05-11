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
import { useCallback, useEffect, useState } from 'react'
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
  const getPostContents = useCallback(
    async (contentTypeId?: string) => {
      try {
        const response = await getContent(contentTypeId)

        if (response?.status === false) {
          dispatch(setError(response.data.message))
          toast.error(response.data.message)
          return
        } else if (response?.status === true) {
          dispatch(setPosts(response.contents))
        }

        // if (response?.data?.contents) {
        //   dispatch(setPosts(response.data.contents))
        // }
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
    },
    [dispatch]
  )
  const contentTypeReq = useCallback(async () => {
    dispatch(setLoading(true))

    try {
      const response = await getContentTypes()
      console.log('Content Types Response:', response)

      // if (response?.data?.status === false) {
      //   dispatch(setError(response.data.message))
      //   toast.error(response.data.message)
      // }

      if (response?.contentTypes) {
        dispatch(setContentTypes(response.contentTypes))
        // After setting content types, fetch all posts
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
  }, [dispatch, getPostContents])

  const handleContentTypeChange = useCallback(
    async (contentType: ContentType | null) => {
      setSelectedContentType(contentType)
      dispatch(setLoading(true))
      try {
        await getPostContents(contentType?.id)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch, getPostContents]
  )

  const handleDeleteModal = useCallback((post: Post) => {
    setPostToDelete({
      id: post.id,
      title: post.data.title,
      postTypeId: post.type_id,
    })
  }, [])

  const deleteContentFunc = useCallback(
    async (postId: string) => {
      try {
        dispatch(setLoading(true))
        const response = await deleteContent(postId)

        if (response.data.status === false) {
          toast.error(response.data.message || 'Failed to delete post')
          return
        } else if (response.data.status === true) {
          toast.success('Post deleted successfully')
          await getPostContents(selectedContentType?.id)
          setPostToDelete(null)
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
    },
    [dispatch, getPostContents, selectedContentType?.id]
  )

  useEffect(() => {
    contentTypeReq()
  }, [contentTypeReq, dispatch])

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
            className='w-full lg:w-auto md:w-auto'
          >
            <Button
              variant='default'
              size='lg'
              className='w-full lg:w-auto md:w-auto gap-2'
            >
              <BiPlus className='h-4 w-4' />
              New Post
            </Button>
          </Link>
        </div>
      </header>

      <div className='rounded-xl border bg-card w-full overflow-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  {' '}
                  <TableCell className='font-medium max-w-[200px] truncate'>
                    {post.data.title}
                  </TableCell>
                  <TableCell>{post.data.author}</TableCell>
                  <TableCell className='capitalize'>
                    {contentTypes.find((type) => type.id === post.type_id)
                      ?.name || post.type_id}
                  </TableCell>
                  <TableCell className='capitalize'>{post.status}</TableCell>
                  <TableCell>
                    {format(new Date(post.created_at), 'dd MMMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-4'>
                      <Link href={`/dashboard/${post.id}`}>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-muted-foreground hover:text-foreground'
                        >
                          <FiEdit2 className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteModal(post)}
                        className='text-muted-foreground hover:text-destructive focus:text-destructive'
                      >
                        <FiTrash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center'>
                  No posts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!postToDelete}
        onOpenChange={(isOpen) => !isOpen && setPostToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the post &quot;
              {postToDelete?.title}&quot;.
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setPostToDelete(null)}
              className='w-full sm:w-auto'
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => postToDelete && deleteContentFunc(postToDelete.id)}
              className='w-full sm:w-auto'
            >
              {loading ? (
                <span className='flex items-center gap-2'>
                  <span className='h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin'></span>
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
