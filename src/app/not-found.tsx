import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BiHome } from 'react-icons/bi'

export default function NotFound() {
  return (
    <main className='h-screen w-full flex flex-col items-center justify-center gap-5 text-center bg-gray-50'>
      <h1 className='text-9xl font-bold text-gray-800'>404</h1>

      <div className='space-y-2'>
        <h2 className='text-3xl font-semibold text-gray-700'>Page Not Found</h2>
        <p className='text-gray-500'>
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link href='/'>
        <Button size='lg' className='gap-2 h-14 cursor-pointer'>
          <BiHome className='text-xl' />
          Back to Home
        </Button>
      </Link>
    </main>
  )
}
