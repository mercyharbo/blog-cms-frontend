'use client'

import { useState } from 'react'

interface Post {
  id: string
  data: {
    title: string
    content: string
    author: string
    created_at: string
    updated_at: string
  }
}

interface SinglePostPageProps {
  postId: string
}

export default function SinglePostPage({ postId }: SinglePostPageProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  //   useEffect(() => {
  //     const fetchPost = async () => {
  //       try {
  //         // Replace with your actual API call
  //         const response = await fetch(`/api/posts/${params.id}`)
  //         const data = await response.json()
  //         setPost(data)
  //       } catch (error) {
  //         console.error('Error fetching post:', error)
  //       } finally {
  //         setLoading(false)
  //       }
  //     }

  //     fetchPost()
  //   }, [params.id])

  //   if (loading) {
  //     return <PageLoadingSpinner />
  //   }

  return (
    <main className='min-h-screen p-6 max-w-4xl mx-auto'>
      post details for: {postId}
    </main>
  )
}
