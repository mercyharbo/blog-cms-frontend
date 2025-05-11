import SinglePostPage from '@/components/posts/singlepost'
import { cookies } from 'next/headers'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const postTypeId = cookieStore.get('postTypeId')?.value

  if (!postTypeId) {
    throw new Error('Post type not found')
  }

  return <SinglePostPage postId={id} />
}
