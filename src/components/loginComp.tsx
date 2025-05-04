'use client'

import { authService } from '@/services/auth'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface LoginResponse {
  message: string
  session: {
    access_token: string
    expires_in: number
    expires_at: number
    refresh_token: string
  }
  user: {
    email: string
    id: string
  }
}

export default function LoginPage() {
  const router = useRouter()
  const cookiestore = new Cookies()

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

    const { data, error } = (await authService.login({
      email,
      password,
    })) as { data: LoginResponse | null; error: string | null }

    if (error) {
      toast.error(error)
    } else if (data) {
      cookiestore.set('access_token', data.session.access_token, {
        expires: new Date(data.session.expires_at * 1000),
        secure: true,
        sameSite: 'strict',
      })

      const refreshTokenExpiry = new Date(data.session.expires_at * 1000)
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7)

      cookiestore.set('refresh_token', data.session.refresh_token, {
        expires: refreshTokenExpiry,
        secure: true,
        sameSite: 'strict',
      })

      toast.success(data.message)
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className='min-h-screen px-5 flex flex-col items-center justify-center bg-gray-100'>
      <div className='bg-white p-5 lg:p-10 rounded-lg shadow-md w-full flex flex-col items-center gap-5 lg:w-5/12'>
        <div className='flex flex-col items-center justify-center gap-4 mb-6'>
          {/* <img src='/logo.png' alt='Logo' className='h-16 w-16' /> */}
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-gray-600 text-center text-sm max-w-xs'>
            Access your content management system to create, edit, and manage
            your digital content seamlessly.
          </p>
        </div>

        <form
          autoComplete='on'
          onSubmit={handleLogin}
          className='w-full flex flex-col gap-5'
        >
          <Input
            type='email'
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='h-12'
            required
          />

          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='h-12'
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
            >
              {showPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </button>
          </div>

          <Button
            type='submit'
            disabled={loading}
            className='h-12 cursor-pointer'
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className='text-center text-gray-600 flex items-center justify-center gap-1'>
          Don't have an account?{' '}
          <Link href='/signup' className='text-blue-600 hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
