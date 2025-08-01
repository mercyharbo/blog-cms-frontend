'use client'

import { createContent, updateContent } from '@/api/contentReq'
import { fetcherWithAuth } from '@/api/fetcher'
import CreateContentTypeDialog from '@/components/content-types/CreateContentTypeDialog'
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
import { cn, useToken } from '@/lib/utils'
import { setContentTypes, setError } from '@/store/features/contentSlice'
import { Post, PostData, PostFormProps, SinglePost } from '@/types/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiPlus } from 'react-icons/bi'
import { toast } from 'react-toastify'
import slugify from 'slugify'
import useSWR from 'swr'
import * as z from 'zod'
import RichTextEditor from '../editor/RichTextEditor'

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
  // author: z.string().min(1, 'Author is required'),
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

// Type guard to check if the post is a SinglePost
function isSinglePost(post: Post | SinglePost | undefined): post is SinglePost {
  return (post as SinglePost)?.data !== undefined
}

// Helper function to get the value from either Post or SinglePost
function getPostValue<K extends keyof PostData>(
  post: Post | SinglePost | undefined,
  key: K
): PostData[K] {
  if (!post) return getDefaultValue(key)
  return isSinglePost(post) ? post.data[key] : (post as Post)[key]
}

// Helper function to get default values
function getDefaultValue<K extends keyof PostData>(key: K): PostData[K] {
  switch (key) {
    case 'cover_image':
      return { alt: '', url: '' } as PostData[K]
    case 'tags':
      return [] as string[] as PostData[K]
    case 'meta_keywords':
      return [] as string[] as PostData[K]
    case 'reading_time':
      return 0 as PostData[K]
    default:
      return '' as PostData[K]
  }
}

export default function PostForm({
  initialData,
  isEditing = false,
  onSuccess,
}: PostFormProps) {
  const router = useRouter()
  const token = useToken()
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const { contentTypes } = useAppSelector((state) => state.content)
  const { profile } = useAppSelector((state) => state.user)

  /* The `const { mutate } = useSWR(...)` statement is using the `useSWR` hook from the SWR library in
   React. Here's what it's doing: */
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

  /* The above code snippet is using the useForm hook from a form library in a TypeScript React
application. It is initializing a form for creating a post with default values provided. The form is
configured with a resolver using Zod schema validation for the post data fields. The default values
for the form fields are set based on the initialData object, with fallback values if the properties
are not present. The form includes fields such as title, slug, author, content, status,
scheduled_at, cover_image, tags, meta_title, meta_keywords, reading_time, and postType. */
  const form = useForm<CreatePostData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: getPostValue(initialData, 'title'),
      slug: getPostValue(initialData, 'slug'),
      // author: getPostValue(initialData, 'author'),
      content: getPostValue(initialData, 'content'),
      status: initialData?.status || 'draft',
      scheduled_at: initialData?.scheduled_at ?? null,
      cover_image: getPostValue(initialData, 'cover_image'),
      tags: getPostValue(initialData, 'tags'),
      meta_title: getPostValue(initialData, 'meta_title'),
      meta_keywords: getPostValue(initialData, 'meta_keywords'),
      reading_time: getPostValue(initialData, 'reading_time'),
      postType: initialData?.type_id || '',
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    const slug = slugify(newTitle, { lower: true, strict: true })
    form.setValue('title', newTitle)
    form.setValue('slug', slug)
  }

  /**
   * The function `handleSubmit` handles the submission of form data for creating or updating a post,
   * including validation and API calls.
   * @param {CreatePostData} formData - The `formData` parameter in the `handleSubmit` function contains
   * data for creating or updating a post. It includes the following properties:
   * @returns In the `handleSubmit` function, various conditions are checked and different actions are
   * taken based on the form data and whether it is in editing mode or not. Here is what is being
   * returned based on different scenarios:
   */
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
        author:
          profile?.profile.is_annonymous !== false
            ? profile?.profile.username ?? 'Unknown'
            : 'Anonymous',

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
          author:
            profile?.profile.is_annonymous !== false
              ? profile?.profile.username ?? 'Unknown'
              : 'Anonymous',
          cover_image: payload.cover_image,
          reading_time: payload.reading_time,
          tags: payload.tags,
          meta_title: payload.meta_title,
          meta_keywords: payload.meta_keywords,
          status: payload.status,
          ...(payload.scheduled_at && { scheduled_at: payload.scheduled_at }),
        }

        const data = await createContent(payload.type_id, contentPayload)

        if (data.data.status === false) {
          toast.error(data.data.message)
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

  // Add this to check form validity
  const isFormValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  return (
    <main
      className={cn(
        ' w-full overflow-y-auto scrollbar-hide p-5 dark:bg-background',
        isEditing ? 'h-full' : 'h-[calc(100vh-4rem)]'
      )}
    >
      <div className='max-w-4xl w-full mx-auto'>
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
            className={cn('space-y-5')}
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
            {/* <FormField
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
          /> */}
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
                        className='w-full p-2 border dark:border-gray-700 rounded-lg dark:bg-primary-foreground'
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
                          className={cn(
                            'px-2 h-12 border dark:border-gray-700 rounded-lg dark:bg-primary-foreground ',
                            profile?.profile.role === 'admin'
                              ? 'w-full'
                              : 'w-[90%]'
                          )}
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
                          className='h-12 w-[10%] dark:border-gray-700 hover:text-white flex items-center justify-center'
                        >
                          <BiPlus />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {profile?.profile.role === 'admin' && (
                <CreateContentTypeDialog
                  open={showDialog}
                  onOpenChange={setShowDialog}
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
                  <FormDescription className='text-gray-400'>
                    Press enter to add keywords
                  </FormDescription>
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
              <Button
                type='button'
                variant='outline'
                className='hover:text-white'
              >
                Cancel
              </Button>
              <Button
                type='submit'
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
      </div>
    </main>
  )
}
