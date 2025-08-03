'use client'

import { deleteContentType } from '@/api/contentReq'
import { fetcherWithAuth } from '@/api/fetcher'
import CreateContentTypeDialog from '@/components/content-types/CreateContentTypeDialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useToken } from '@/lib/utils'
import { setContentTypes, setError } from '@/store/features/contentSlice'
import { format } from 'date-fns'
import { useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import useSWR from 'swr'

export default function ContentTypes() {
  const token = useToken()
  const dispatch = useAppDispatch()
  const [showDialog, setShowDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('') // New state for search
  const [selectedType, setSelectedType] = useState<{
    id: string
    title: string
    name: string
    description: string | null
  } | null>(null)
  const { contentTypes, loading } = useAppSelector((state) => state.content)

  const { mutate } = useSWR(
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

  const handleDeleteContenType = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await deleteContentType(id)
      if (res.status === false) {
        dispatch(setError(res.message))
        toast.error(res.message)
      } else {
        toast.success(res.message)
        setTimeout(() => {
          mutate()
        }, 5000)
      }
    } catch (error) {
      let errorMsg = 'An error occurred while deleting content type'
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
  }

  const handleOpenDialog = (type?: typeof selectedType) => {
    setSelectedType(type || null)
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setSelectedType(null)
    setShowDialog(false)
  }

  // Filter content types based on search query
  const filteredContentTypes = contentTypes.filter((type) =>
    `${type.title} ${type.name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <main className='m-auto w-full'>
      <Card className='dark:bg-background dark:border-gray-700 bg-white w-[98%] h-[calc(100dvh-7rem)] m-auto'>
        <CardHeader className='justify-between items-start gap-5 lg:items-center w-full flex-col lg:flex-row'>
          <div className='flex flex-col gap-1'>
            <CardTitle className='text-xl font-semibold'>
              Manage Content Types
            </CardTitle>
            <CardDescription>
              View, search, and create structured content types to organize your
              posts and data more effectively.
            </CardDescription>
          </div>

          <div className='flex items-start gap-5 flex-col w-full lg:w-auto lg:items-center lg:flex-row md:flex-row'>
            <Input
              placeholder='Search content types...'
              className='lg:w-[400px] md:w-[70%] w-full'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1) // Reset to page 1 on search
              }}
            />
            <Button
              variant='default'
              size='lg'
              type='button'
              onClick={() => handleOpenDialog()}
              className='h-12 items-center gap-2 w-full lg:w-auto md:w-[30%]'
            >
              <BiPlus />
              Create Content Type
            </Button>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col space-y-5 overflow-y-auto scrollbar-hide'>
          <Table className='rounded-lg'>
            <TableHeader className='bg-muted text-muted-foreground'>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContentTypes.length > 0 ? (
                filteredContentTypes
                  .slice((page - 1) * 25, page * 25)
                  .map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className='font-medium'>
                        {type.title}
                      </TableCell>
                      <TableCell>{type.name}</TableCell>
                      <TableCell>
                        {format(new Date(type.updated_at), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-4'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleOpenDialog(type)}
                            className='text-muted-foreground'
                          >
                            <FiEdit2 className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              setTypeToDelete(type.id)
                              setShowDeleteDialog(true)
                            }}
                            disabled={loading}
                            className='text-muted-foreground'
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
                        No content types found
                      </span>
                      <span className='text-sm'>
                        Try adjusting your search or create a new content type.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredContentTypes.length > 25 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page <= 1}
                  />
                </PaginationItem>
                {Array.from(
                  { length: Math.ceil(filteredContentTypes.length / 25) },
                  (_, i) => i + 1
                ).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href='#'
                      onClick={() => setPage(pageNumber)}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          Math.ceil(filteredContentTypes.length / 25),
                          p + 1
                        )
                      )
                    }
                    aria-disabled={
                      page >= Math.ceil(filteredContentTypes.length / 25)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content type? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (typeToDelete) {
                  handleDeleteContenType(typeToDelete)
                  setShowDeleteDialog(false)
                  setTypeToDelete(null)
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateContentTypeDialog
        open={showDialog}
        onOpenChange={handleCloseDialog}
        initialData={selectedType}
      />
    </main>
  )
}
