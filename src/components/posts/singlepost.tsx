'use client'

import { getContentDetails } from '@/api/contentReq'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  setCurrentPost,
  setError,
  setLoading,
} from '@/store/features/contentSlice'
import TiptapImage from '@tiptap/extension-image' // Rename the TipTap import
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from 'next/image' // Add Next.js Image import
import { useCallback, useEffect, useState } from 'react'
import { FiCalendar, FiEdit2, FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify'
import BreadcrumbNav from '../ui/BreadcrumbNav'
import PageLoadingSpinner from '../ui/PageLoadingSpinner'
import { SlideOutModal } from '../ui/SlideOutModal'
import PostForm from './PostForm'

interface SinglePostPageProps {
  postId: string
  // postTypeId: string
}

export default function SinglePostPage({ postId }: SinglePostPageProps) {
  const dispatch = useAppDispatch()
  const { currentPost, loading } = useAppSelector((state) => state.content)

  // Add useCallback to memoize getContentsDetails
  const getContentsDetails = useCallback(async () => {
    try {
      dispatch(setLoading(true))
      const response = await getContentDetails(postId)

      if (response.status === false) {
        dispatch(setError(response.message || 'Error fetching content'))
        toast.error(response.message || 'Error fetching content')
        return
      } else if (response.status === true) {
        dispatch(setCurrentPost(response.content))
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch post details'
      dispatch(setError(errorMessage))
      toast.error(errorMessage)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, postId])

  // Move editor initialization after data fetching
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bold: {},
        italic: {},
        blockquote: {},
        strike: {},
        code: {},
        listItem: {},
        bulletList: {},
        orderedList: {},
      }),
      TiptapImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg w-full md:w-2/3 my-6',
        },
      }),
    ],
    editable: false,
    content: currentPost?.data.content || '', // Initialize with content if available
  })

  // Fetch post details on mount
  useEffect(() => {
    getContentsDetails()
  }, [postId, getContentsDetails])

  // Update editor content when post changes
  useEffect(() => {
    if (currentPost?.data.content && editor) {
      const processContent = (content: string) => {
        return (
          content
            // Handle headings
            .replace(/### (.*$)/gm, '<h3>$1</h3>')
            .replace(/## (.*$)/gm, '<h2>$1</h2>')
            .replace(/# (.*$)/gm, '<h1>$1</h1>')
            // Handle bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Handle italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Handle blockquotes
            .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
            // Handle code blocks
            .replace(
              /```(\w+)?\n([\s\S]*?)\n```/g,
              '<pre><code>$2</code></pre>'
            )
            // Handle inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Handle images
            .replace(
              /!\[(.*?)\]\((data:image\/[^;]+;base64,[^)]+)\)/g,
              '<img src="$1" />'
            )
            // Handle lists
            .replace(/^\s*[-*+] (.*)$/gm, '<ul><li>$1</li></ul>')
            .replace(/^\s*\d+\. (.*)$/gm, '<ol><li>$1</li></ol>')
            // Handle paragraphs
            .split('\n\n')
            .map((paragraph) => {
              if (!paragraph.startsWith('<')) {
                return `<p>${paragraph}</p>`
              }
              return paragraph
            })
            .join('')
        )
      }

      const processedContent = processContent(currentPost.data.content)
      editor.commands.setContent(processedContent)
    }
  }, [currentPost?.data.content, editor])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const handleEditClick = () => setIsEditModalOpen(true)

  if (loading && !currentPost) {
    return <PageLoadingSpinner />
  }

  if (!currentPost) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Post not found</h1>
      </div>
    )
  }

  return (
    <main className='max-w-6xl mx-auto px-4 flex flex-col gap-8 sm:px-6 lg:px-8'>
      <BreadcrumbNav />

      <div className='flex flex-col space-y-8'>
        <div className='flex items-center justify-between gap-4'>
          <h1 className='text-4xl font-bold tracking-tight text-foreground'>
            {currentPost?.data.title}
          </h1>

          <Button
            variant='default'
            size='lg'
            className='gap-2'
            onClick={handleEditClick}
          >
            <FiEdit2 className='h-4 w-4' />
            Edit Post
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <FiUser className='h-4 w-4' />
              <span>{currentPost?.data.author}</span>
            </div>

            <div className='flex items-center gap-2'>
              <FiCalendar className='h-4 w-4' />
              <span>
                Created on{' '}
                {new Date(currentPost?.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <Badge
            variant={
              currentPost?.status === 'published'
                ? 'default'
                : currentPost?.status === 'scheduled'
                ? 'destructive'
                : 'secondary'
            }
            className='capitalize'
          >
            {currentPost?.status === 'scheduled'
              ? '🕒 Scheduled'
              : currentPost?.status}
          </Badge>
        </div>

        <div className='flex flex-wrap gap-2'>
          {currentPost?.data.tags?.map((tag) => (
            <Badge key={tag} variant='outline' className='capitalize'>
              {tag}
            </Badge>
          ))}
        </div>

        {currentPost?.status === 'scheduled' && currentPost?.scheduled_at ? (
          <div className='flex items-center gap-2'>
            <FiCalendar className='h-4 w-4' />
            <span>
              Scheduled for{' '}
              {new Date(currentPost?.scheduled_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
          </div>
        ) : null}

        <div className='post-cover-image'>
          {currentPost?.data.cover_image && (
            <Image
              src={currentPost?.data.cover_image.url}
              alt={currentPost?.data.cover_image.alt}
              width={1200}
              height={500}
              className='h-[400px] object-cover rounded-lg w-full'
              priority
            />
          )}
        </div>

        <article
          className='prose prose-lg max-w-none 
          prose-headings:text-foreground 
          prose-p:text-muted-foreground 
          prose-blockquote:border-primary 
          prose-strong:text-primary
          prose-img:rounded-lg
          prose-pre:bg-muted
          prose-pre:p-4
          prose-pre:rounded-lg
        '
        >
          <EditorContent editor={editor} className='min-h-[200px]' />
        </article>
      </div>

      <SlideOutModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit: ${currentPost?.data.title}`}
      >
        <PostForm
          initialData={currentPost}
          isEditing={true}
          onSuccess={() => {
            setIsEditModalOpen(false)
            getContentsDetails()
          }}
        />
      </SlideOutModal>
    </main>
  )
}
