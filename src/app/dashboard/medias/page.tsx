'use client'

import { fetcherWithAuth } from '@/api/fetcher'
import { deleteMedia } from '@/api/mediaReq'
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
import { Label } from '@/components/ui/label'
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useToken } from '@/lib/utils'
import { setError, setMedia } from '@/store/features/mediaSlice'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { BiTrash } from 'react-icons/bi'
import { FaEye } from 'react-icons/fa'
import { MdOutlinePermMedia } from 'react-icons/md'
import { toast } from 'react-toastify'
import useSWR from 'swr'

interface MediaMetadata {
  width?: number
  height?: number
  duration?: number
  format?: string
  [key: string]: string | number | undefined
}

export interface MediaItem {
  id: string
  filename: string
  originalname: string
  mimetype: string
  size: number
  url: string
  description: string | null
  alt_text: string | null
  metadata: MediaMetadata | null
  created_at: string
  updated_at: string
  user_id: string
}

export default function MediaPage() {
  const token = useToken()
  const dispatch = useAppDispatch()
  const { media } = useAppSelector((state) => state.media)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [mediaToView, setMediaToView] = useState<MediaItem | null>(null)
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customFileName, setCustomFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate, isLoading } = useSWR(
    token
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/api/media`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ]
      : null,
    fetcherWithAuth,
    {
      onError: (err) => {
        dispatch(setError(err.message || 'Failed to fetch media'))
        toast.error(err.message || 'Failed to fetch media')
      },
      onSuccess: (data) => {
        dispatch(setMedia(data.media || []))
      },
    }
  )

  const handleUpload = async (
    file: File | null,
    customName: string
  ): Promise<void> => {
    if (!file) return
    setIsUploading(true)

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/media/upload`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                file: reader.result,
                originalname: customName || file.name,
              }),
            }
          )

          const res = await response.json()

          if (!res.status) {
            toast.error(res.message)
          } else {
            toast.success('Media uploaded successfully')
            mutate()
          }
        } catch (err) {
          toast.error('Failed to upload media')
          console.log(err)
        } finally {
          setIsUploading(false)
          setSelectedFile(null)
          setCustomFileName('')
          setShowUploadDialog(false)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }
      }

      reader.onerror = () => {
        toast.error('Failed to read file')
        setIsUploading(false)
        setSelectedFile(null)
        setCustomFileName('')
        setShowUploadDialog(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to upload media')
      setIsUploading(false)
      setSelectedFile(null)
      setCustomFileName('')
      setShowUploadDialog(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteMedia(id, token)
      if (res.status === false) {
        toast.error(res.message)
      } else {
        toast.success('Media deleted successfully')
        mutate()
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete media')
    } finally {
      setShowDeleteDialog(false)
      setMediaToDelete(null)
    }
  }

  const filteredMedia = media?.filter((item: MediaItem) =>
    item.originalname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <PageLoadingSpinner />
  }

  return (
    <main className='m-auto w-full'>
      <Card className='dark:bg-background dark:border-gray-700 bg-white w-[98%] h-[calc(100dvh-7rem)] m-auto overflow-y-auto scrollbar-hide'>
        <CardHeader className='justify-between items-start gap-5 lg:items-center w-full flex-col lg:flex-row'>
          <div className='flex flex-col gap-1'>
            <CardTitle className='text-xl font-semibold'>
              Media Library
            </CardTitle>
            <CardDescription>
              Manage your uploaded media files, including images, videos, and
              more.
            </CardDescription>
          </div>
          <div className='flex items-start gap-5 flex-col w-full lg:w-auto lg:items-center lg:flex-row md:flex-row'>
            <Input
              placeholder='Search media...'
              className='lg:w-[400px] md:w-[70%] w-full'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
            />
            <Button
              variant='default'
              size='lg'
              onClick={() => setShowUploadDialog(true)}
              className='h-12 items-center gap-2 w-full lg:w-auto md:w-[30%]'
              disabled={isUploading}
            >
              <MdOutlinePermMedia />
              Add Media
            </Button>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col'>
          {filteredMedia?.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {filteredMedia
                .slice((page - 1) * 20, page * 20)
                .map((item: MediaItem) => (
                  <div
                    key={item.id}
                    className='relative group border rounded-lg overflow-hidden bg-white dark:bg-gray-800'
                  >
                    <Image
                      src={item.url}
                      alt={item.alt_text || item.originalname}
                      width={300}
                      height={200}
                      className='w-full h-40 object-cover'
                    />

                    <div className='p-3'>
                      <p className='text-sm font-medium truncate text-gray-900 dark:text-white'>
                        {item.originalname}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className='absolute top-2 right-2 transition-opacity flex gap-2'>
                      <button
                        onClick={() => {
                          setMediaToView(item)
                          setShowViewDialog(true)
                        }}
                        className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                      >
                        <FaEye className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => {
                          setMediaToDelete(item.id)
                          setShowDeleteDialog(true)
                        }}
                        className='p-2 bg-red-500 text-white rounded hover:bg-red-600'
                      >
                        <BiTrash className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-64 text-muted-foreground'>
              <span className='text-lg font-medium'>No media found</span>
              <span className='text-sm'>
                Try adjusting your search or upload new media.
              </span>
            </div>
          )}

          {filteredMedia.length > 20 && (
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
                  { length: Math.ceil(filteredMedia.length / 20) },
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
                        Math.min(Math.ceil(filteredMedia.length / 20), p + 1)
                      )
                    }
                    aria-disabled={page >= Math.ceil(filteredMedia.length / 20)}
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
            <DialogTitle>Delete Media</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this media file? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => mediaToDelete && handleDelete(mediaToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Select a media file and provide a name for it.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='file' className='text-right'>
                File
              </Label>
              <Input
                id='file'
                type='file'
                accept='image/*,video/*'
                className='col-span-3'
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setSelectedFile(file)
                  setCustomFileName(file ? file.name : '')
                }}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='filename' className='text-right'>
                File Name
              </Label>
              <Input
                id='filename'
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                className='col-span-3'
                placeholder='Enter custom file name'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='ghost'
              onClick={() => {
                setShowUploadDialog(false)
                setSelectedFile(null)
                setCustomFileName('')
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              Cancel
            </Button>
            <Button
              variant='default'
              onClick={() => handleUpload(selectedFile, customFileName)}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>{mediaToView?.originalname}</DialogTitle>
            <DialogDescription>
              View the media file in full size.
            </DialogDescription>
          </DialogHeader>
          {mediaToView && (
            <div className='flex justify-center'>
              <Image
                src={mediaToView.url}
                alt={mediaToView.alt_text || mediaToView.originalname}
                width={mediaToView.metadata?.width || 800}
                height={mediaToView.metadata?.height || 600}
                className='max-w-full max-h-[70vh] object-contain'
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant='ghost'
              onClick={() => {
                setShowViewDialog(false)
                setMediaToView(null)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
