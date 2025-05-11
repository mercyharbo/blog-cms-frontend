'use client'

import { getContentTypes } from '@/api/contentReq'
import CreateContentTypeDialog from '@/components/content-types/CreateContentTypeDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  setContentTypes,
  setError,
  setLoading,
} from '@/store/features/contentSlice'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function ContentTypes() {
  const dispatch = useAppDispatch()
  const [showDialog, setShowDialog] = useState(false)
  const [selectedType, setSelectedType] = useState<{
    id: string
    title: string
    name: string
    description: string | null
  } | null>(null)
  const { contentTypes, loading } = useAppSelector((state) => state.content)

  const handleOpenDialog = (type?: typeof selectedType) => {
    setSelectedType(type || null)
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setSelectedType(null)
    setShowDialog(false)
  }

  const contentTypeReq = async () => {
    dispatch(setLoading(true))

    try {
      const response = await getContentTypes()

      if (response.status === false) {
        dispatch(setError(response.message))
        toast.error(response.message)
      } else if (response.contentTypes) {
        dispatch(setContentTypes(response.contentTypes))
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

  useEffect(() => {
    contentTypeReq()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  if (loading) {
    return <PageLoadingSpinner />
  }

  return (
    <main className='flex flex-col gap-8 w-full py-10'>
      <header className='flex justify-between items-center w-full'>
        <h1 className='text-4xl font-bold tracking-tight text-foreground'>
          Content Types
        </h1>
        <div className='flex items-center gap-5'>
          <Input placeholder='Search...' className='w-[300px]' />
          <Button
            variant='default'
            size='lg'
            type='button'
            onClick={() => handleOpenDialog()}
            className='h-12 items-center gap-2'
          >
            <BiPlus />
            Create Content Type
          </Button>
        </div>
        <CreateContentTypeDialog
          open={showDialog}
          onOpenChange={handleCloseDialog}
          onSuccess={contentTypeReq}
          initialData={selectedType}
        />
      </header>

      <div className='rounded-xl border bg-card w-full overflow-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentTypes.length > 0 ? (
              contentTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className='font-medium'>{type.title}</TableCell>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>
                    {format(new Date(type.updated_at), 'dd MMM yyyy, HH:mm')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleOpenDialog(type)}
                        className='text-muted-foreground hover:text-foreground'
                      >
                        <FiEdit2 className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
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
                <TableCell colSpan={4} className='text-center'>
                  No content types found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
