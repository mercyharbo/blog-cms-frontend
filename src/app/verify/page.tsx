'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'
import { RiMailLine } from 'react-icons/ri'

function VerifyPageContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  )

  useEffect(() => {
    const verifyEmail = async () => {
      const type = searchParams.get('type')
      if (type === 'signup') {
        const { error } = await supabase.auth.getUser()
        if (error) {
          setStatus('error')
        } else {
          setStatus('success')
        }
      } else {
        setStatus('error')
      }
    }

    verifyEmail()
  }, [searchParams, supabase.auth])

  return (
    <main className='min-h-screen px-5 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-800 p-8 lg:p-10 rounded-2xl shadow-lg w-full flex flex-col items-center gap-6 lg:max-w-xl border border-gray-100 dark:border-gray-700'>
        <div className='flex flex-col items-center justify-center gap-3 w-full'>
          <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center'>
            {status === 'verifying' && (
              <RiMailLine className='w-8 h-8 text-primary animate-pulse' />
            )}
            {status === 'success' && (
              <HiCheckCircle className='w-8 h-8 text-emerald-500' />
            )}
            {status === 'error' && (
              <HiExclamationCircle className='w-8 h-8 text-red-500' />
            )}
          </div>

          {status === 'verifying' && (
            <>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Verifying Email
              </h1>
              <div className='flex flex-col items-center gap-4'>
                <div className='h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
                <p className='text-gray-500 dark:text-gray-400 text-center text-sm'>
                  Please wait while we verify your email address...
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Email Verified
              </h1>
              <p className='text-gray-500 dark:text-gray-400 text-center text-sm'>
                Your email has been successfully verified. You can now log in to
                your QuillDesk account.
              </p>
              <Link href='/' className='w-full'>
                <Button className='w-full h-11 mt-4 font-medium transition-all capitalize'>
                  Continue to Login
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Verification Failed
              </h1>
              <p className='text-gray-500 dark:text-gray-400 text-center text-sm'>
                We couldn&apos;t verify your email address. This might happen if
                the verification link has expired or is invalid.
              </p>
              <Link href='/' className='w-full'>
                <Button
                  variant='outline'
                  className='w-full h-11 mt-4 font-medium transition-all capitalize'
                >
                  Back to Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className='min-h-screen px-5 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900'>
          <div className='bg-white dark:bg-gray-800 p-8 lg:p-10 rounded-2xl shadow-lg w-full flex flex-col items-center gap-6 lg:max-w-xl border border-gray-100 dark:border-gray-700'>
            <div className='flex flex-col items-center justify-center gap-3 w-full'>
              <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center'>
                <RiMailLine className='w-8 h-8 text-primary animate-pulse' />
              </div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Loading...
              </h1>
              <div className='flex flex-col items-center gap-4'>
                <div className='h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
                <p className='text-gray-500 dark:text-gray-400 text-center text-sm'>
                  Please wait...
                </p>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <VerifyPageContent />
    </Suspense>
  )
}
