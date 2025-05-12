'use client'

import { forgetPassword } from '@/api/authReq'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { DiIe } from 'react-icons/di'
import { toast } from 'react-toastify'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await forgetPassword(email)
      if (response.status === false) {
        toast.error(response.message)
        return
      } else if (response.status === true) {
        setIsEmailSent(true)
        toast.success(response.message)
        setEmail('')
      }
    } catch (error) {
      console.error('Error sending reset link:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen px-5 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-800 p-8 lg:p-10 rounded-2xl shadow-lg w-full flex flex-col items-center gap-6 lg:w-2/5 border border-gray-100 dark:border-gray-700'>
        <div className='flex flex-col items-center justify-center gap-3 w-full'>
          <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center'>
            <DiIe />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Forgot Password
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-center text-sm max-w-sm'>
            Enter your email and we’ll send you a link to reset your password.
          </p>
        </div>
        <form
          autoComplete='on'
          onSubmit={handleForgotPassword}
          className='w-full flex flex-col gap-5'
        >
          <div className='space-y-2'>
            <Label htmlFor='email'>Email address</Label>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='h-11 transition-all'
              required
            />
          </div>{' '}
          <Button
            type='submit'
            disabled={loading}
            className='h-11 mt-2 font-medium transition-all capitalize'
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Sending link...
              </div>
            ) : (
              'Send reset link'
            )}
          </Button>
          {isEmailSent && (
            <div className='mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl animate-fade-in'>
              <p className='text-emerald-800 dark:text-emerald-300 text-sm text-center'>
                Password reset link has been sent to{' '}
                <span className='font-medium'>{email}</span>. Please check your
                inbox and follow the instructions to reset your password.
              </p>
            </div>
          )}
        </form>
        <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1'>
          Remember your password?{' '}
          <Link href='/' className='text-primary underline'>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
