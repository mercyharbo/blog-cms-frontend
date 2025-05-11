'use client'

import {
  createContent,
  createContentType,
  getContentTypes,
  updateContent,
} from '@/api/contentReq'
import RichTextEditor from '@/components/editor/RichTextEditor'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Label } from '@radix-ui/react-label'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiPlus } from 'react-icons/bi'
import { toast } from 'react-toastify'
import slugify from 'slugify'
import * as z from 'zod'
import { Textarea } from '../ui/textarea'

interface CreatePayload {
  title: string
  slug: string
  content: string
  author: string
  cover_image: {
    url: string
    alt: string
  }
  status: 'draft' | 'published' | 'scheduled'
  type_id: string
  reading_time: number
  tags: string[]
  meta_title: string
  meta_keywords: string[]
  scheduled_at?: string | null
}

type PostPayload = CreatePayload & { type_id: string }

// Update the form schema first
const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string(),
  author: z.string().min(1, 'Author is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduled_at: z.string().nullable().optional(),
  postType: z.string().min(1, 'Post type is required'),
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
    type_id: string
    user_id: string
    created_at: string
    updated_at: string
    published_at: string | null
    scheduled_at: string | null
    status: 'draft' | 'published' | 'scheduled'
    data: {
      title: string
      slug: string
      author: string
      content: string
      cover_image?: { alt: string; url: string }
      tags: string[]
      meta_title: string
      meta_keywords: string[]
      reading_time: number
    }
    content_type?: ContentType
  }
  isEditing?: boolean
  onSuccess?: () => void
}

export default function PostForm({
  initialData,
  isEditing = false,
  onSuccess,
}: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [newTypeTitle, setNewTypeTitle] = useState('')
  const [newTypeDescription, setNewTypeDescription] = useState('')
  const { postTypeId: reduxPostTypeId, contentTypes } = useAppSelector(
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
      status: initialData?.status || 'draft',
      scheduled_at: initialData?.scheduled_at ?? null,
      cover_image: initialData?.data?.cover_image || { alt: '', url: '' },
      tags: initialData?.data?.tags || [],
      meta_title: initialData?.data?.meta_title || '',
      meta_keywords: initialData?.data?.meta_keywords || [],
      reading_time: initialData?.data?.reading_time || 0,
      postType: initialData?.type_id || reduxPostTypeId || '',
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

      if (formData.status === 'scheduled') {
        if (!formData.scheduled_at) {
          toast.error('Schedule date and time is required for scheduled posts')
          return
        }

        const scheduledDate = new Date(formData.scheduled_at)
        if (scheduledDate <= new Date()) {
          toast.error('Schedule date and time must be in the future')
          return
        }

        // Convert to UTC ISO string for backend
        formData.scheduled_at = scheduledDate.toISOString()
      }

      // Restructure the payload to match the API's expected format
      const payload: PostPayload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content.replace(/\n/g, ''), // Remove extra newlines
        author: formData.author,
        cover_image: {
          url: formData.cover_image.url,
          alt: formData.cover_image.alt || formData.title, // Use title as fallback for alt
        },
        status: formData.status,
        type_id: formData.postType,
        reading_time: formData.reading_time,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        meta_title: formData.meta_title,
        meta_keywords: Array.isArray(formData.meta_keywords)
          ? formData.meta_keywords
          : [],
        ...(formData.scheduled_at
          ? { scheduled_at: formData.scheduled_at }
          : {}),
      }

      if (isEditing) {
        if (!initialData) {
          toast.error('Post data not found')
          return
        }

        const data = await updateContent(initialData.id, payload)
        console.log('data', data)
        if (data.data.status === false) {
          toast.error(data.data.message)
          return
        } else if (data.data.status === true) {
          toast.success('Post updated successfully')
          setTimeout(() => {
            window.location.reload()
          }, 5000)
        }
      } else {
        // Format payload according to API requirements
        const contentPayload = {
          title: payload.title,
          slug: payload.slug,
          content: payload.content,
          author: payload.author,
          cover_image: payload.cover_image,
          reading_time: payload.reading_time,
          tags: payload.tags,
          meta_title: payload.meta_title,
          meta_keywords: payload.meta_keywords,
          status: payload.status,
          ...(payload.scheduled_at && { scheduled_at: payload.scheduled_at }),
        }

        const data = await createContent(payload.type_id, contentPayload)

        if (data.data.error) {
          toast.error(data.data.error)
          return
        }
        toast.success('Post created successfully')
        setTimeout(() => {
          router.push('/dashboard')
        }, 5000)
      }

      onSuccess?.()
    } catch (err) {
      console.error('Form submission error:', err)
      toast.error(isEditing ? 'Failed to update post' : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * The function `createContentTypeReq` handles the creation of a content type with error handling and
   * success notifications.
   * @returns The `createContentTypeReq` function returns either nothing (undefined) if the
   * `newTypeTitle` is not provided, or it returns after creating a new content type successfully and
   * handling any errors that may occur during the process.
   */
  const createContentTypeReq = async () => {
    if (!newTypeTitle) {
      toast.error('Title is required')
      return
    }

    dispatch(setLoading(true))

    try {
      const payload = {
        title: newTypeTitle,
        slug: slugify(newTypeTitle, { lower: true, strict: true }),
        description: newTypeDescription,
      }

      const data = await createContentType(payload)
      console.log('data', data)

      // if (data?.data?.error) {
      //   dispatch(setError(data.data.error))
      //   toast.error(data.data.error)
      // } else {
      //   toast.success('Content type created successfully')
      //   setShowDialog(false)
      //   setNewTypeTitle('')
      //   setNewTypeDescription('')
      //   // Refresh content types list
      //   await contentTypeReq()
      // }

      toast.success('Content type created successfully')
      setShowDialog(false)
      setNewTypeTitle('')
      setNewTypeDescription('')
      // Refresh content types list
      await contentTypeReq()
    } catch (error) {
      let errorMsg = 'An error occurred while creating content type'
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
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className='w-full p-2 border rounded-md dark:bg-black dark:text-white'
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        if (e.target.value !== 'scheduled') {
                          form.setValue('scheduled_at', null)
                        }
                      }}
                    >
                      <option value='draft'>Draft</option>
                      <option value='published'>Published</option>
                      <option value='scheduled'>Scheduled</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='postType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Type</FormLabel>{' '}
                  <FormControl>
                    <div className='flex items-center gap-5 w-full'>
                      <select
                        {...field}
                        className='w-[90%] px-2 h-12 border rounded-md dark:bg-black dark:text-white'
                        defaultValue={reduxPostTypeId || ''}
                      >
                        <option value=''>Select a type</option>
                        {contentTypes?.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>

                      <Button
                        size={'sm'}
                        variant={'outline'}
                        onClick={() => setShowDialog(true)}
                        type='button'
                        className='h-12 w-[10%] flex items-center justify-center'
                      >
                        <BiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Content Type</DialogTitle>
                  <DialogDescription>
                    Add a new type of content to your CMS
                  </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-5 w-full'>
                  <div className='flex flex-col gap-3 w-full'>
                    <Label>Title</Label>
                    <Input
                      placeholder='e.g., Blog Post, News Article, etc.'
                      value={newTypeTitle}
                      onChange={(e) => setNewTypeTitle(e.target.value)}
                    />
                  </div>
                  <div className='flex flex-col gap-3 w-full'>
                    <Label>Slug</Label>
                    <Input
                      value={slugify(newTypeTitle, {
                        lower: true,
                        strict: true,
                      })}
                      disabled
                    />
                    <p className='text-sm text-accent-foreground'>
                      Auto-generated from title
                    </p>
                  </div>
                  <div className='flex flex-col gap-3 w-full'>
                    <Label>Description</Label>
                    <Textarea
                      placeholder='Describe the purpose of this content type...'
                      value={newTypeDescription}
                      onChange={(e) => setNewTypeDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type='button' onClick={createContentTypeReq}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {form.watch('status') === 'scheduled' && (
              <FormField
                control={form.control}
                name='scheduled_at'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date and Time</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        {...field}
                        value={field.value || ''}
                        min={new Date().toISOString().slice(0, 16)}
                        className='w-full p-2 border rounded-md'
                      />
                    </FormControl>
                    <FormDescription>
                      Select when you want this post to be published
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
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
