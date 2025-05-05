'use client'

import { postUserRegister } from '@/api/authReq'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  /**
   * The handleSignup function is an asynchronous function that handles form submission for user
   * registration, displaying success or error messages accordingly.
   * @param e - The parameter `e` in the `handleSignup` function is of type
   * `React.FormEvent<HTMLFormElement>`. This parameter represents the form event that is triggered when
   * the form is submitted. In this case, the function is handling the form submission for a signup form
   * in a React application.
   */
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await postUserRegister(email, password)

      if (data?.error) {
        toast.error(data.error)
      } else if (data) {
        toast.success('Account created successfully! Please login to continue.')
        router.push('/')
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
    <div className='min-h-screen px-5 flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-5 lg:p-10 rounded-lg shadow-md w-full flex flex-col items-center gap-5 lg:w-5/12'>
        <div className='flex flex-col items-center justify-center gap-4 mb-6'>
          {/* <img src='/logo.png' alt='Logo' className='h-16 w-16' /> */}
          <h1 className='text-2xl font-bold'>Create an Account</h1>
          <p className='text-gray-600 text-center text-sm max-w-xs'>
            Join our content management system to start creating and managing
            your digital content today.
          </p>
        </div>

        <form onSubmit={handleSignup} className='w-full flex flex-col gap-5'>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='h-12'
            required
          />
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='h-12 pr-10'
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
            className='h-12 cursor-pointer'
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
      </div>
    </div>
  )
}
