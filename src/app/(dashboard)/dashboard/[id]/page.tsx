import SinglePostPage from '@/components/posts/singlepost'
import { cookies } from 'next/headers'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id
  const cookieStore = await cookies()
  const postTypeId = cookieStore.get('postTypeId')?.value

  if (!postTypeId) {
    throw new Error('Post type not found')
  }

  const post = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/${postTypeId}/${id}`
  ).then((res) => res.json())

  console.log('post', post)

  return {
    title: `${post?.content?.data?.title || 'View Post'} | CMS Dashboard`,
    description: 'View detailed blog post content',
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = params.id

  return <SinglePostPage postId={id} />
}
