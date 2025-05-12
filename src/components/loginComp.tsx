'use client'

import { postUserLogin } from '@/api/authReq'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DiIe } from 'react-icons/di'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  /**
   * The function `handleLogin` is an asynchronous function that handles form submission for user login,
   * sets cookies with access and refresh tokens upon successful login, and redirects the user to the
   * dashboard page.
   * @param e - The parameter `e` in the `handleLogin` function is of type
   * `React.FormEvent<HTMLFormElement>`. This parameter represents the form event that is triggered when
   * the form is submitted. In this case, the function is handling the form submission for a login form
   * in a React application. By
   */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await postUserLogin(email, password)

      if (data?.status === true) {
        toast.success(data.message)
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else if (data?.status === false) {
        toast.error(data?.message || 'Login failed')
      }
    } catch (error) {
      let errorMsg = 'An error occurred while fetching content types'
      if (error instanceof Error) {
        errorMsg = error.message
      } else if (typeof error === 'string') {
        errorMsg = error
      }

      toast.error(errorMsg)
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
            Welcome Back
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-center text-sm max-w-sm'>
            Access your content management system to create, edit, and manage
            your digital content seamlessly.
          </p>
        </div>{' '}
        <form
          autoComplete='on'
          onSubmit={handleLogin}
          className='w-full flex flex-col gap-5'
        >
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Email address
            </label>
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
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='password'
              className='text-sm font-medium text-gray-700 dark:text-gray-300'
            >
              Password
            </label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='h-11 transition-all'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
              >
                {showPassword ? (
                  <IoEyeOffOutline size={18} />
                ) : (
                  <IoEyeOutline size={18} />
                )}
              </button>
            </div>
          </div>

          <Button
            type='submit'
            disabled={loading}
            className='h-11 mt-2 font-medium transition-all'
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Logging in...
              </div>
            ) : (
              'Sign in to your account'
            )}
          </Button>
        </form>
        <div className='flex flex-col justify-center items-center gap-4 text-sm'>
          {' '}
          <p className='text-gray-500 dark:text-gray-400 flex items-center gap-1'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='font-medium text-primary hover:text-primary/90 transition-colors'
            >
              Create an account
            </Link>
          </p>
          <p className='text-gray-500 dark:text-gray-400 flex items-center gap-1'>
            Forget your password?{' '}
            <Link
              href='/forget-password'
              className='font-medium text-primary hover:text-primary/90 transition-colors'
            >
              Reset password
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
