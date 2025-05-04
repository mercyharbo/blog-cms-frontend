'use client'

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
import { contentService } from '@/services/content'
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
  featuredImage: z.string().optional(), // Simplified validation for now
  tags: z.array(z.string()),
  publishedAt: z.string(),
  metaDescription: z.string().min(1, 'Meta description is required'),
})

// Infer the type from the schema
type CreatePostData = z.infer<typeof postSchema>

export default function PostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const dispatch = useAppDispatch()
  const { posts, loading, error, postTypeId } = useAppSelector(
    (state) => state.content
  )

  const getContentTypes = async () => {
    dispatch(setLoading(true))

    const { data, error } = (await contentService.getContentTypes()) as {
      data: { contentTypes: ContentType[] } | null
      error: string | null
    }

    if (error) {
      dispatch(setError(error))
      toast.error(error)
    } else if (data?.contentTypes) {
      dispatch(setContentTypes(data.contentTypes))

      const postType = data.contentTypes.find((type) => type.name === 'post')

      if (postType) {
        dispatch(setPostTypeId(postType.id))
      }
    }
  }

  useEffect(() => {
    getContentTypes()
  }, [dispatch])

  const form = useForm<CreatePostData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      author: '',
      content: '',
      status: 'draft',
      featuredImage: '',
      tags: [],
      publishedAt: new Date().toISOString(),
      metaDescription: '',
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = slugify(title, { lower: true, strict: true })
    form.setValue('title', title)
    form.setValue('slug', slug)
  }

  // Usage in PostForm.tsx
  const handleSubmit = async (formData: CreatePostData) => {
    try {
      setIsSubmitting(true)

      if (!postTypeId) {
        toast.error('Post type not found')
        return
      }

      // Clean up the data before sending
      const cleanData = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        publishedAt: new Date().toISOString(),
        // Ensure all fields are in correct format
        status: formData.status || 'draft',
        featuredImage: formData.featuredImage || '',
        metaDescription: formData.metaDescription || '',
      }

      const { error } = await contentService.createContent(
        postTypeId,
        cleanData
      )

      if (error) {
        toast.error(error)
        return
      }

      toast.success('Post created successfully')
      router.push('/dashboard')
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Load content types on mount if not already loaded
  useEffect(() => {
    if (!postTypeId) {
      getContentTypes()
    }
  }, [])

  return (
    <main className='min-h-screen flex flex-col gap-5 p-4 md:p-6'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='w-full mx-auto flex flex-col gap-5 lg:w-2/3'
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
            name='metaDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className='w-full p-2 border rounded-md'
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  Brief description for SEO purposes (recommended: 150-160
                  characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='featuredImage'
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={value || ''} // Ensure value is never undefined
                    onChange={onChange} // Pass through the form's onChange
                    onRemove={() => onChange('')} // Clear the value on remove
                  />
                </FormControl>
                <FormDescription>
                  Upload an image (max 5MB). Supported formats: PNG, JPG, JPEG,
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
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  )
}
