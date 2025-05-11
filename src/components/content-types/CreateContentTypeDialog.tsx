'use client'

import {
  createContentType,
  getContentTypes,
  updateContentType,
} from '@/api/contentReq'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch } from '@/hooks/redux'
import { setContentTypes, setError } from '@/store/features/contentSlice'
import { Label } from '@radix-ui/react-label'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import slugify from 'slugify'

interface CreateContentTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  initialData?: {
    id: string
    title: string
    name: string
    description: string | null
  } | null
}

export default function CreateContentTypeDialog({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: CreateContentTypeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
    }
  }, [initialData])

/**
 * The function `handleSubmit` handles the submission of a form for creating or updating a content
 * type, displaying success or error messages accordingly.
 * @returns The `handleSubmit` function returns nothing explicitly. It either executes the code within
 * the try block and catches any errors in the catch block, or it returns early if the `title` is not
 * provided.
 */
  const handleSubmit = async () => {
    if (!title) {
      toast.error('Title is required')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        description,
      }

      let response
      if (initialData?.id) {
        response = await updateContentType(initialData.id, payload)
      } else {
        response = await createContentType(payload)
      }

      if (response.status === false) {
        dispatch(setError(response.message))
        toast.error(response.message)
      } else {
        toast.success(
          initialData
            ? 'Content type updated successfully'
            : 'Content type created successfully'
        )
        onOpenChange(false)
        setTitle('')
        setDescription('')

        // Fetch updated content types
        const updatedTypesResponse = await getContentTypes()
        if (updatedTypesResponse.contentTypes) {
          dispatch(setContentTypes(updatedTypesResponse.contentTypes))
          onSuccess?.()
        }
      }
    } catch (error) {
      let errorMsg = `An error occurred while ${
        initialData ? 'updating' : 'creating'
      } content type`
      if (error instanceof Error) {
        errorMsg = error.message
      } else if (typeof error === 'string') {
        errorMsg = error
      }
      dispatch(setError(errorMsg))
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex flex-col gap-5'>
        <DialogHeader>
          <DialogTitle>Create New Content Type</DialogTitle>
          <DialogDescription>
            Add a new type of content to your CMS
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-5 w-full'>
          <div className='flex flex-col gap-2 w-full'>
            <Label className='text-sm'>Title</Label>
            <Input
              placeholder='e.g., Blog Post, News Article, etc.'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <Label className='text-sm'>Slug</Label>
            <Input
              value={slugify(title, {
                lower: true,
                strict: true,
              })}
              disabled
            />
            <p className='text-sm'>Auto-generated from title</p>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <Label className='text-sm'>Description</Label>
            <Textarea
              placeholder='Describe the purpose of this content type...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>{' '}
          <Button type='button' disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting
              ? initialData
                ? 'Updating...'
                : 'Creating...'
              : initialData
              ? 'Update'
              : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
