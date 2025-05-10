'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function VerificationPageContent() {
  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const params = useParams<{ token: string; type: string }>()

  console.log('Search params:', params)
  console.log('verificationStatus:', verificationStatus)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from the URL
        const token = params.token
        const type = params.type

        if (!token) {
          setErrorMessage('Verification token is missing')
          setVerificationStatus('error')
          return
        }

        if (type !== 'signup') {
          setErrorMessage('Invalid verification type')
          setVerificationStatus('error')
          return
        }

        // Set a delay to show the success message for a moment
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setVerificationStatus('success')
      } catch (error) {
        console.error('Verification error:', error)
        setErrorMessage('An unexpected error occurred during verification')
        setVerificationStatus('error')
      }
    }

    verifyEmail()
  }, [params])

  if (verificationStatus === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-md p-8 space-y-4 text-center'>
          <h1 className='text-2xl font-bold'>Verifying your email...</h1>
          <p className='text-muted-foreground'>
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    )
  }
  if (verificationStatus === 'error') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-md p-8 space-y-4 text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto'>
            <svg
              className='w-8 h-8 text-red-500'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path d='M6 18L18 6M6 6l12 12'></path>
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-red-600'>
            Verification Failed
          </h1>
          <p className='text-muted-foreground'>
            {errorMessage ||
              "Sorry, we couldn't verify your email address. The link might be expired or invalid."}
          </p>
          <div className='pt-4'>
            <Button asChild>
              <Link href='/signup'>Try signing up again</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-8 space-y-6 text-center'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
          <svg
            className='w-8 h-8 text-green-500'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path d='M5 13l4 4L19 7'></path>
          </svg>
        </div>
        <h1 className='text-2xl font-bold'>Email Verified Successfully!</h1>
        <p className='text-muted-foreground'>
          Thank you for verifying your email address. You can now sign in to
          your account.
        </p>
        <div className='pt-4'>
          <Button asChild>
            <Link href='/'>Sign in to your account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='w-full max-w-md p-8 space-y-4 text-center'>
            <h1 className='text-2xl font-bold'>Loading...</h1>
            <p className='text-muted-foreground'>Please wait...</p>
          </div>
        </div>
      }
    >
      <VerificationPageContent />
    </Suspense>
  )
}
