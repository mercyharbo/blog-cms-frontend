import SinglePostPage from '@/components/posts/singlepost'

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <SinglePostPage postId={id} />
}
