import SinglePostPage from '@/components/posts/singlepost'
import { cookies } from 'next/headers'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const postTypeId = cookieStore.get('postTypeId')?.value

  if (!postTypeId) {
    throw new Error('Post type not found')
  }

  const post = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content/${postTypeId}/${id}`
  ).then((res) => res.json())

  const contentPreview = post?.data?.content?.substring(0, 160) + '...'

  return {
    title: `${post?.data?.title || 'View Post'} | CMS Dashboard`,
    description:
      contentPreview || 'Read this detailed blog post on our CMS platform',
  }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const postTypeId = cookieStore.get('postTypeId')?.value

  if (!postTypeId) {
    throw new Error('Post type not found')
  }

  return <SinglePostPage postId={id} postTypeId={postTypeId} />
}
