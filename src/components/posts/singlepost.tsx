'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { contentService } from '@/services/content'
import {
  setCurrentPost,
  setError,
  setLoading,
} from '@/store/features/contentSlice'
import { ContentDetailsResponse } from '@/types/content'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { FiCalendar, FiEdit2, FiUser } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import BreadcrumbNav from '../ui/BreadcrumbNav'
import PageLoadingSpinner from '../ui/PageLoadingSpinner'

interface SinglePostPageProps {
  postId: string
  postTypeId: string
}

export default function SinglePostPage({
  postId,
  postTypeId,
}: SinglePostPageProps) {
  const dispatch = useAppDispatch()
  const { currentPost, loading } = useAppSelector((state) => state.content)

  const getContentsDetails = async () => {
    dispatch(setLoading(true))
    const { data, error } = (await contentService.getContentDetails(
      postTypeId,
      postId
    )) as {
      data: ContentDetailsResponse | null
      error: string | null
    }

    if (error) {
      dispatch(setError(error))
      toast.error(error)
    } else if (data) {
      dispatch(setCurrentPost(data.content))
    }
    dispatch(setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getContentsDetails()
  }, [dispatch])

  if (loading || !currentPost) {
    return <PageLoadingSpinner />
  }

  console.log('currentPost', currentPost)

  return (
    <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
      <BreadcrumbNav />

      <div className='py-6 space-y-4'>
        <div className='flex items-center justify-between gap-4'>
          <h1 className='text-4xl font-bold tracking-tight text-foreground'>
            {currentPost?.data?.title}
          </h1>
          <Link href={`/dashboard/posts/${postId}/edit`} passHref>
            <Button variant='default' size='sm' className='gap-2'>
              <FiEdit2 className='h-4 w-4' />
              Edit Post
            </Button>
          </Link>
        </div>

        <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <FiUser className='h-4 w-4' />
            <span>{currentPost?.data?.author}</span>
          </div>
          <div className='flex items-center gap-2'>
            <FiCalendar className='h-4 w-4' />
            <time>
              {new Date(currentPost?.data?.publishedAt).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
            </time>
          </div>
          <Badge
            variant={
              currentPost?.data?.status === 'published'
                ? 'default'
                : 'secondary'
            }
            className='capitalize'
          >
            {currentPost?.data?.status}
          </Badge>
          <div className='flex flex-wrap gap-2'>
            {currentPost?.data?.tags.map((tag) => (
              <Badge key={tag} variant='outline' className='capitalize'>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <article className='prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-blockquote:border-primary prose-strong:text-primary'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            h1: ({ children }) => (
              <h1 className='text-4xl font-bold my-6 animate-in fade-in-50'>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-3xl font-bold my-5 animate-in fade-in-50'>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-2xl font-bold my-4 animate-in fade-in-50'>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className='my-4 leading-relaxed animate-in fade-in-50'>
                {children}
              </p>
            ),
            blockquote: ({ children }) => (
              <blockquote className='border-l-4 pl-4 my-6 italic bg-muted/50 py-2 rounded-sm animate-in slide-in-from-left'>
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className='font-bold text-primary'>{children}</strong>
            ),
            img: ({ src, alt }) => (
              <div className='relative w-full h-[400px] my-6 rounded-lg overflow-hidden animate-in zoom-in-50'>
                <Image
                  src={String(src || '/placeholder-image.jpg')}
                  alt={alt || 'Blog image'}
                  fill
                  className='object-cover rounded-lg hover:scale-105 transition-transform duration-300'
                  unoptimized={
                    typeof src === 'string' && src.startsWith('data:')
                  }
                />
              </div>
            ),
            code: ({ children }) => (
              <code className='block bg-muted p-4 rounded-lg overflow-x-auto'>
                {children}
              </code>
            ),
          }}
        >
          {currentPost?.data?.content || ''}
        </ReactMarkdown>
      </article>
    </main>
  )
}
