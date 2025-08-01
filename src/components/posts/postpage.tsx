'use client'

import { deleteContent } from '@/api/contentReq'
import { fetcherWithAuth } from '@/api/fetcher'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useToken } from '@/lib/utils'
import {
  setContentTypes,
  setError,
  setPosts,
} from '@/store/features/contentSlice'
import { ContentType } from '@/types/content'
import { Post } from '@/types/post'
import { format } from 'date-fns'
import { FilterIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { FaEye } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import PageLoadingSpinner from '../ui/PageLoadingSpinner'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

export default function PostListPage() {
  const token = useToken()
  const dispatch = useAppDispatch()
  const { posts, contentTypes } = useAppSelector((state) => state.content)
  const [page, setPage] = useState(1)
  const [selectedContentType, setSelectedContentType] =
    useState<ContentType | null>(null)
  const [postToDelete, setPostToDelete] = useState<{
    id: string
    title: string
    postTypeId: string
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  /* The above code is using the `useSWR` hook from the SWR library in a TypeScript React component. It
  is fetching data from an API endpoint based on the `token` and `selectedContentType` values. If
  the `token` is present, it constructs the API endpoint URL with the token for authorization. It
  then uses the `fetcherWithAuth` function to make the API request. */
  const { isLoading: contentLoading, mutate } = useSWR(
    token
      ? [
          selectedContentType?.id
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/content/type/${selectedContentType.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/content`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ]
      : null,
    fetcherWithAuth,
    {
      onError: (err) => {
        dispatch(setError(err.message || 'Failed to fetch content types'))
        toast.error(err.message || 'Failed to fetch content types')
      },
      onSuccess: (data) => {
        dispatch(setPosts(data.contents || []))
      },
    }
  )

  /* The above code snippet is using the `useSWR` hook from the SWR library in a TypeScript React
  component. */
  const { isLoading: contentTypeLoading } = useSWR(
    token
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/api/content/types`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ]
      : null,
    fetcherWithAuth,
    {
      onError: (err) => {
        dispatch(setError(err.message || 'Failed to fetch content types'))
        toast.error(err.message || 'Failed to fetch content types')
      },
      onSuccess: (data) => {
        dispatch(setContentTypes(data.contentTypes || []))
      },
    }
  )

  /**
   * The function `handleContentTypeChange` sets the selected content type based on the input parameter.
   * @param {ContentType | null} contentType - The `contentType` parameter in the
   * `handleContentTypeChange` function is of type `ContentType | null`. This means it can either be a
   * value of the `ContentType` type or `null`. When this function is called, it sets the selected
   * content type to the value passed in as the `contentType
   */
  const handleContentTypeChange = async (contentType: ContentType | null) => {
    setSelectedContentType(contentType)
  }

  const handleDeleteModal = useCallback((post: Post) => {
    setPostToDelete({
      id: post.id,
      title: post.title,
      postTypeId: post.type_id,
    })
  }, [])

  const deleteContentFunc = useCallback(
    async (postId: string) => {
      try {
        setIsDeleting(true)
        const response = await deleteContent(postId)

        if (response.data.status === false) {
          toast.error(response.data.message || 'Failed to delete post')
          return
        } else if (response.data.status === true) {
          toast.success(response.data.message || 'Post deleted successfully')
          mutate() // Re-fetch the content after deletion
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
        setIsDeleting(false)
      }
    },
    [dispatch, selectedContentType?.id]
  )

  if (contentLoading || !posts || contentTypeLoading) {
    return <PageLoadingSpinner />
  }

  return (
    <main className='m-auto w-full'>
      <Card className='dark:bg-background dark:border-gray-700 m-auto h-[calc(100dvh-5rem)] w-[98%]'>
        <CardHeader className='flex flex-col items-start max-sm:gap-5 lg:flex-row lg:items-center md:flex-row md:items-center justify-between w-full'>
          <div className='flex flex-col gap-2 lg:w-auto md:w-[50%] sm:w-auto'>
            <CardTitle>Manage Posts</CardTitle>
            <CardDescription>
              View, filter, and organize all your published and scheduled posts
              in one place.
            </CardDescription>
          </div>

          <div className='flex flex-col items-start lg:flex-row lg:items-center gap-4 w-full lg:w-auto md:w-auto md:flex-row'>
            <div className='flex items-center gap-2 w-full lg:w-auto md:w-[200px]'>
              <FilterIcon size={15} />
              <Select
                value={selectedContentType?.id || ''}
                onValueChange={(value) => {
                  if (value === '') {
                    handleContentTypeChange(null)
                  } else {
                    const selected = contentTypes.find((ct) => ct.id === value)
                    if (selected) {
                      handleContentTypeChange(selected)
                    }
                  }
                }}
              >
                <SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 max-sm:w-full lg:w-auto md:w-[200px]'>
                  <SelectValue placeholder='All Content' />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Link
              href={`/dashboard/create-post${
                selectedContentType ? `?type=${selectedContentType.id}` : ''
              }`}
              className='w-full lg:w-auto'
            >
              <Button variant='default' className='w-full lg:w-auto'>
                <BiPlus className='h-4 w-4' />
                New Post
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col space-y-5 overflow-y-auto scrollbar-hide'>
          <Table className='scrollbar-hide'>
            <TableHeader className='bg-muted text-muted-foreground'>
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
              {posts?.length > 0 ? (
                posts?.slice((page - 1) * 25, page * 25).map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className='font-medium max-w-[200px] truncate'>
                      {post.title || 'Untitled'}
                    </TableCell>
                    <TableCell>{post.author || 'Unknown'}</TableCell>
                    <TableCell className='capitalize'>
                      {contentTypes.find((type) => type.id === post.type_id)
                        ?.name ||
                        post.type_id ||
                        'Unknown'}
                    </TableCell>
                    <TableCell className='capitalize'>
                      {post.status || 'draft'}
                    </TableCell>
                    <TableCell>
                      {post.created_at
                        ? format(new Date(post.created_at), 'dd MMMM yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-4'>
                        <Link href={`/dashboard/contents/${post.id}`}>
                          <Button variant='ghost' size='sm' className=''>
                            <FaEye className='h-4 w-4' />
                          </Button>
                        </Link>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDeleteModal(post)}
                          className=''
                        >
                          <FiTrash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='h-64 p-8'>
                    <div className='flex flex-col items-center justify-center h-full text-muted-foreground'>
                      <span className='text-lg font-medium'>
                        No posts found
                      </span>
                      <span className='text-sm'>
                        Try adjusting your filters or create a new post.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {posts?.length > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((p) => Math.max(1, p - 1))
                    }}
                    aria-disabled={page <= 1}
                  />
                </PaginationItem>
                {Array.from(
                  { length: Math.ceil(posts.length / 25) },
                  (_, i) => i + 1
                ).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href='#'
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(pageNumber)
                      }}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((p) =>
                        Math.min(Math.ceil(posts.length / 25), p + 1)
                      )
                    }}
                    aria-disabled={page >= Math.ceil(posts.length / 25)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!postToDelete}
        onOpenChange={(isOpen) => !isOpen && setPostToDelete(null)}
      >
        <DialogContent className='dark:border-gray-800 dark:bg-gray-700 space-y-5'>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              post
            </DialogDescription>
          </DialogHeader>

          <p className=''>
            This will permanently delete the post{' '}
            <strong>{postToDelete?.title}</strong>
            This action cannot be undone.
          </p>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setPostToDelete(null)}
              className='w-full hover:text-white sm:w-auto'
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => postToDelete && deleteContentFunc(postToDelete.id)}
              disabled={isDeleting}
              className='w-full sm:w-auto'
            >
              {isDeleting ? (
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
