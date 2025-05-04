'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { contentService } from '@/services/content'
import {
  setCurrentPost,
  setError,
  setLoading,
} from '@/store/features/contentSlice'
import { ContentDetailsResponse } from '@/types/content'
import Image from 'next/image'
import { useEffect } from 'react'
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

  useEffect(() => {
    getContentsDetails()
  }, [])

  if (loading || !currentPost) {
    return <PageLoadingSpinner />
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Bar */}
      <header className='sticky top-0 z-10 bg-white border-b px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-gray-800'>
            {currentPost.data.title}
          </h1>
          <div className='flex items-center gap-4'>
            <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
              Edit Post
            </button>
          </div>
        </div>
      </header>

      <BreadcrumbNav />

      <main className='p-6 max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-sm'>
          {currentPost?.data?.featuredImage && (
            <div className='relative w-full h-[400px] border-b'>
              <Image
                src={currentPost.data.featuredImage}
                alt={currentPost.data.title || 'Featured image'}
                fill
                className='object-cover rounded-t-lg'
                priority
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                // Add error handling for image loading failures
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-image.jpg'
                }}
              />
            </div>
          )}

          <article className='prose prose-lg max-w-none p-6'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                h1: ({ children }) => (
                  <h1 className='text-4xl font-bold my-6'>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className='text-3xl font-bold my-5'>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className='text-2xl font-bold my-4'>{children}</h3>
                ),
                p: ({ children }) => (
                  <p className='my-4 text-gray-700 leading-relaxed'>
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className='border-l-4 border-primary pl-4 my-6 italic bg-gray-50 py-2'>
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className='font-bold text-primary'>{children}</strong>
                ),
                img: ({ src, alt }) => (
                  <div className='relative w-full h-[400px] my-6'>
                    <Image
                      src={
                        typeof src === 'string' ? src : '/placeholder-image.jpg'
                      }
                      alt={alt || ''}
                      fill
                      className='object-cover rounded-lg'
                    />
                  </div>
                ),
                code: ({ className, children }) => (
                  <code
                    className={`${
                      className || ''
                    } block bg-gray-800 text-white p-4 rounded-lg`}
                  >
                    {children}
                  </code>
                ),
              }}
            >
              {typeof currentPost.data.content === 'string'
                ? currentPost.data.content
                : JSON.stringify(currentPost.data.content)}
            </ReactMarkdown>
          </article>
        </div>
      </main>
    </div>
  )
}
