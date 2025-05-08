'use client'

import { createContent, getContentTypes, updateContent } from '@/api/contentReq'
import RichTextEditor from '@/components/editor/RichTextEditor'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { TagInput } from '@/components/ui/tag-input'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { cn } from '@/lib/utils'
import {
  setContentTypes,
  setError,
  setLoading,
  setPostTypeId,
} from '@/store/features/contentSlice'
import { ContentType } from '@/types/content'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import slugify from 'slugify'
import * as z from 'zod'

// Update the form schema first
const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string(),
  author: z.string().min(1, 'Author is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published']),
  cover_image: z.object({
    alt: z.string(),
    url: z.string().url(),
  }),
  tags: z.array(z.string()),
  meta_title: z.string(),
  meta_keywords: z.array(z.string()),
  reading_time: z.number(),
})

// Infer the type from the schema
type CreatePostData = z.infer<typeof postSchema>

interface PostFormProps {
  initialData?: {
    id: string
    content_type_id: string
    data: {
      title: string
      slug: string
      author: string
      content: string
      status: 'draft' | 'published'
      cover_image?: { alt: string; url: string } // Changed from featuredImage to cover_image
      tags: string[]
      meta_title: string // Added meta_title
      meta_keywords: string[] // Added meta_keywords
      reading_time: number // Added reading_time
    }
  }
  contentTypeId?: string // Changed from postTypeId to contentTypeId
  isEditing?: boolean
  onSuccess?: () => void
}

export default function PostForm({
  initialData,
  contentTypeId, // Changed prop name
  isEditing = false,
  onSuccess,
}: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { postTypeId: reduxPostTypeId } = useAppSelector(
    (state) => state.content
  )
  const dispatch = useAppDispatch()

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

  useEffect(() => {
    contentTypeReq()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const form = useForm<CreatePostData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.data?.title || '',
      slug: initialData?.data?.slug || '',
      author: initialData?.data?.author || '',
      content: initialData?.data?.content || '',
      status: initialData?.data?.status || 'draft',
      cover_image: initialData?.data?.cover_image || { alt: '', url: '' },
      tags: initialData?.data?.tags || [],
      meta_title: initialData?.data?.meta_title || '',
      meta_keywords: initialData?.data?.meta_keywords || [],
      reading_time: initialData?.data?.reading_time || 0,
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    const slug = slugify(newTitle, { lower: true, strict: true })
    form.setValue('title', newTitle)
    form.setValue('slug', slug)
  }

  const handleSubmit = async (formData: CreatePostData) => {
    try {
      setIsSubmitting(true)

      const activePostTypeId = isEditing ? contentTypeId : reduxPostTypeId

      if (!activePostTypeId) {
        toast.error('Post type not found')
        return
      }

      const payload = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        status: formData.status || 'draft',
      }

      if (isEditing) {
        if (!initialData) {
          toast.error('Post data not found')
          return
        }

        const data = await updateContent(
          activePostTypeId,
          initialData.id,
          payload
        )
        if (data.data.error) {
          toast.error(data.data.error)
          return
        }
        toast.success('Post updated successfully')
        setTimeout(() => {
          router.push('/dashboard')
        }, 5000)
      } else {
        const data = await createContent(activePostTypeId, payload)
        if (data.data.error) {
          toast.error(data.data.error)
          return
        }
        toast.success('Post created successfully')
        setTimeout(() => {
          router.push('/dashboard')
        }, 10000)
      }

      onSuccess?.()
    } catch (err) {
      console.error('Form submission error:', err)
      toast.error(isEditing ? 'Failed to update post' : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add this to check form validity
  const isFormValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  return (
    <main
      className={cn(
        'flex flex-col items-center gap-5 p-5 mx-auto w-full ',
        isEditing ? 'w-full' : 'lg:w-3/4'
      )}
    >
      <h1
        className={cn(
          'text-3xl font-bold flex justify-start items-start w-full',
          isEditing ? 'w-full' : 'lg:w-3/4 text-left py-10'
        )}
      >
        {title ? title : 'New Post'}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn(
            'w-full flex flex-col gap-5 overflow-hidden',
            isEditing ? 'w-full' : 'lg:w-3/4'
          )}
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} onChange={handleTitleChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormDescription>Auto-generated from title</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='author'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Add tags...'
                  />
                </FormControl>
                <FormDescription>Press enter to add tags</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select {...field} className='w-full p-2 border rounded-md'>
                    <option value='draft'>Draft</option>
                    <option value='published'>Published</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='meta_title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='meta_keywords'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Keywords</FormLabel>
                <FormControl>
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Add meta keywords...'
                  />
                </FormControl>
                <FormDescription>Press enter to add keywords</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='reading_time'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reading Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='cover_image'
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={value || null}
                    onChange={(imageValue) => onChange(imageValue)}
                    onRemove={() => onChange(null)}
                  />
                </FormControl>
                <FormDescription>
                  Upload an image (max 10MB). Supported formats: PNG, JPG, JPEG,
                  GIF, WEBP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end gap-4'>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
            <Button
              type='submit'
              // disabled={isSubmitting || !isFormValid || !isDirty}
              className={`cursor-pointer ${
                isSubmitting || !isFormValid || !isDirty
                  ? 'cursor-not-allowed opacity-50'
                  : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  )
}
