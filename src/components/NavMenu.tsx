'use client'

import { fetcherWithAuth } from '@/api/fetcher'
import { useAppDispatch } from '@/hooks/redux'
import { cn, useToken } from '@/lib/utils'
import { setError } from '@/store/features/contentSlice'
import { setUserProfile } from '@/store/features/userSlice'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { CgMediaPodcast } from 'react-icons/cg'
import {
  IoColorPalette,
  IoDocumentTextOutline,
  IoSettings,
  IoShieldOutline,
} from 'react-icons/io5'
import { MdArticle } from 'react-icons/md'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import Cookies from 'universal-cookie'
import { Button } from './ui/button'

export const linksItems = [
  { href: '/dashboard/contents', label: 'Posts', icon: <MdArticle /> },
  {
    href: '/dashboard/content-types',
    label: 'Content Types',
    icon: <IoDocumentTextOutline />,
  },
  {
    href: '/dashboard/medias',
    label: 'Medias',
    icon: <CgMediaPodcast />,
  },
]

export const settingsLinks = [
  {
    href: '/dashboard/settings',
    label: 'General Settings',
    icon: <IoSettings />,
  },
  {
    href: '/dashboard/settings/appearance',
    label: 'Appearance',
    icon: <IoColorPalette />,
  },
  {
    href: '/dashboard/settings/security',
    label: 'Security',
    icon: <IoShieldOutline />,
  },
]

export default function NavMenu() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cookiestore = new Cookies()
  const token = useToken()
  const pathname = usePathname()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const {} = useSWR(
    token
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ]
      : null,
    fetcherWithAuth,
    {
      onError: (err) => {
        dispatch(setError(err.message || 'Failed to fetch content types'))
        toast.error(err.message || 'Failed to fetch content types')
      },
      onSuccess: (data) => {
        dispatch(setUserProfile(data.user))
      },
    }
  )

  const handleUserLogout = async () => {
    setIsLoggingOut(true)
    try {
      cookiestore.remove('access_token')
      toast.success('Logging out...')
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 h-screen w-4/5 -translate-x-full gap-10 bg-white dark:bg-background z-50 border-r border-gray-300 dark:border-gray-700 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:flex lg:flex-col lg:px-5 lg:py-10 '
      )}
    >
      <div className='flex items-center justify-between '>
        <Link href={'/'}>
          <h1 className='text-2xl lg:text-3xl font-bold capitalize'>
            QuillDesk
          </h1>
        </Link>
      </div>

      <div className='flex-1 flex flex-col gap-8 lg:pt-16'>
        <div className='flex flex-col gap-4'>
          <span className='text-sm font-medium text-gray-400 uppercase tracking-wider'>
            manage
          </span>
          <div className='flex flex-col gap-2'>
            {linksItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md ${
                  pathname === item.href
                    ? 'dark:bg-gray-700 bg-primary text-white'
                    : 'dark:text-gray-300 text-primary hover:text-white hover:bg-primary dark:hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                <span className='text-lg'>{item.icon}</span>
                <span className='text-sm'>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <span className='text-sm font-medium text-gray-400 uppercase tracking-wider'>
            settings
          </span>
          <div className='flex flex-col gap-2'>
            {settingsLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md ${
                  pathname === item.href
                    ? 'dark:bg-gray-700 bg-primary text-white'
                    : 'dark:text-gray-300 text-primary hover:text-white hover:bg-primary dark:hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                <span className='text-lg'>{item.icon}</span>
                <span className='text-sm'>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Button
        size={'lg'}
        onClick={handleUserLogout}
        disabled={isLoggingOut}
        className='bg-transparent flex justify-start items-center gap-3 shadow-none hover:bg-primary hover:text-white text-primary dark:hover:bg-gray-700 dark:text-gray-300 mt-auto mb-8 lg:mb-0'
      >
        <BiLogOut />
        <span className='text-sm'>
          {isLoggingOut ? 'Logging Out...' : 'Logout'}
        </span>
      </Button>
    </nav>
  )
}
