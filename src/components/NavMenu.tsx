'use client'

import { postUserLogout } from '@/api/authReq'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { BiCategory, BiLogOut } from 'react-icons/bi'
import { FaUsers } from 'react-icons/fa'
import {
  IoCloseOutline,
  IoColorPalette,
  IoDocumentTextOutline,
  IoMenuOutline,
  IoSettings,
  IoShieldOutline,
} from 'react-icons/io5'
import { MdArticle } from 'react-icons/md'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import { Button } from './ui/button'

const linksItems = [
  { href: '/dashboard', label: 'Posts', icon: <MdArticle /> },
  { href: '/dashboard/categories', label: 'Categories', icon: <BiCategory /> },
  { href: '/dashboard/authors', label: 'Authors', icon: <FaUsers /> },
  {
    href: '/dashboard/content-types',
    label: 'Content Types',
    icon: <IoDocumentTextOutline />,
  },
]

const settingsLinks = [
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
  const cookiestore = new Cookies()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleUserLogout = async () => {
    setIsLoggingOut(true)
    try {
      const data = await postUserLogout()

      if (data.status === true) {
        cookiestore.remove('access_token')
        toast.success(data.message)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else if (data.status === false) {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <button
        onClick={toggleMenu}
        className='lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-700 text-white'
      >
        {isOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
      </button>

      <nav
        className={`
        flex flex-col h-screen bg-primary dark:bg-background text-white p-6 pb-20 lg:pb-6
        lg:w-1/5 flex-shrink-0 dark:border-r
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-40 fixed top-0 left-0
      `}
      >
        <div className='flex items-center justify-between mb-8'>
          <Link href={'/'}>
            <h1 className='text-2xl lg:text-3xl font-bold capitalize'>
              QuillDesk
            </h1>
          </Link>

          <button onClick={toggleMenu} className='lg:hidden p-2 -mr-2'>
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className='flex-1 flex flex-col gap-8'>
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
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
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
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
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
          className='bg-transparent flex justify-start items-center gap-3 hover:bg-gray-700 text-gray-300 mt-auto mb-8 lg:mb-0'
        >
          <BiLogOut />
          <span className='text-sm'>
            {isLoggingOut ? 'Logging Out...' : 'Logout'}
          </span>
        </Button>
      </nav>

      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 bg-opacity-50 lg:hidden z-30'
          onClick={toggleMenu}
        />
      )}
    </>
  )
}
