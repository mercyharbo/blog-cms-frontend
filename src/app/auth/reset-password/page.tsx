'use client'

import { postUserResetPassword } from '@/api/authReq'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { DiIe } from 'react-icons/di'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useParams<{ token: string }>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    setLoading(true)
    try {
      // Get the token from the URL query parameters
      const token = searchParams.token

      if (!token) {
        toast.error('Invalid or expired reset link')
        return
      }

      const response = await postUserResetPassword(token, password)

      if (response.status === false) {
        toast.error(response.message || 'Failed to reset password')
      } else if (response.status === true) {
        toast.success('Password reset successful')
        // Redirect to login page after successful password reset
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      toast.error('An error occurred while resetting your password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen px-5 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-800 p-8 lg:p-10 rounded-2xl shadow-lg w-full flex flex-col items-center gap-6 lg:w-[450px] border border-gray-100 dark:border-gray-700'>
        <div className='flex flex-col items-center justify-center gap-3 w-full'>
          <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2'>
            <DiIe className='w-8 h-8 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Reset Password
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-center text-sm max-w-sm'>
            Enter your new password below.
          </p>
        </div>

        <form
          onSubmit={handleResetPassword}
          className='w-full flex flex-col gap-5'
        >
          <div className='space-y-2'>
            <Label htmlFor='password'>New Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter new password'
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

          <div className='space-y-2'>
            <Label htmlFor='confirm-password'>Confirm New Password</Label>
            <div className='relative'>
              <Input
                id='confirm-password'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='h-11 transition-all'
                required
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
              >
                {showConfirmPassword ? (
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
                Resetting password...
              </div>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
