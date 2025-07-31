'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { RiLockPasswordLine } from 'react-icons/ri'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // Password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      toast.error('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
        toast.error(error.message)
      } else {
        setMessage('Your password has been reset successfully!')
        toast.success('Password reset successful! Redirecting to login...')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while sending reset link'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen px-5 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-800 p-8 lg:p-10 rounded-2xl shadow-lg w-full flex flex-col items-center gap-6 lg:max-w-xl border border-gray-100 dark:border-gray-700'>
        <div className='flex flex-col items-center justify-center gap-3 w-full'>
          <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center'>
            <RiLockPasswordLine className='w-8 h-8 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Reset Password
          </h1>
          <p className='text-gray-500 dark:text-gray-400 text-center text-sm max-w-sm'>
            Enter your new password below. Make sure it&apos;s at least 8
            characters long.
          </p>
        </div>
        <form
          onSubmit={handlePasswordUpdate}
          className='w-full flex flex-col gap-5'
        >
          <div className='space-y-2'>
            <Label htmlFor='password'>New Password</Label>
            <Input
              type='password'
              id='password'
              placeholder='Enter new password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='h-11 transition-all'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input
              type='password'
              id='confirmPassword'
              placeholder='Confirm new password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='h-11 transition-all'
              required
            />
          </div>
          <Button
            type='submit'
            disabled={loading}
            className='h-11 mt-2 font-medium transition-all capitalize'
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Updating password...
              </div>
            ) : (
              'Reset Password'
            )}
          </Button>
          {message && (
            <div className='mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl animate-fade-in'>
              <p className='text-emerald-800 dark:text-emerald-300 text-sm text-center'>
                {message}
              </p>
            </div>
          )}
          {error && (
            <div className='mt-4 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl animate-fade-in'>
              <p className='text-red-800 dark:text-red-300 text-sm text-center'>
                {error}
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}
