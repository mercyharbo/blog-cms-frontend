'use client'

import { postUserLogout } from '@/api/authReq'
import { useAppSelector } from '@/hooks/redux'
import { cn } from '@/lib/utils'
import { Bell, ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import { linksItems, settingsLinks } from './NavMenu'
import { Button } from './ui/button'

export default function NavHeaderComp() {
  const router = useRouter()
  const pathname = usePathname()
  const cookiestore = new Cookies()
  const [menuOpen, setMenuOpen] = useState(false)

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { profile } = useAppSelector((state) => state.user)

  console.log('Profile:', profile)

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
      <nav className='h-16 py-2 border-b bg-white dark:bg-background dark:border-gray-700 flex justify-between items-center w-full px-5'>
        <div className='flex items-center gap-4'>
          <button
            className='lg:hidden text-gray-600 dark:text-gray-300'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            size={'icon'}
            variant={'ghost'}
            className='bg-gray-300 dark:bg-gray-700 rounded-full dark:hover:bg-gray-800 dark:hover:text-white'
          >
            <span className='sr-only'>Notifications</span>
            <Bell className='h-6 w-6' />
          </Button>

          <button className='text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1'>
            <span className='sr-only'>Profile</span>
            <Image
              src={profile?.profile.avatar_url || '/default-avatar.png'}
              width={200}
              height={200}
              alt='profile picture'
              className='rounded-full h-10 w-10 object-cover object-top'
            />
            <ChevronDown size={18} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/70 z-30'
            onClick={() => setMenuOpen(false)}
          />

          <div
            className='fixed top-0 left-0 w-[80%] h-dvh z-40 lg:hidden bg-white dark:bg-black border-r shadow-md border-gray-200 
          dark:border-gray-700 px-5 py-4 space-y-5 flex flex-col justify-between'
          >
            <div className='flex flex-col gap-5'>
              <div className='flex items-center justify-between pt-5 pb-12 '>
                <Link href={'/'}>
                  <h1 className='text-2xl lg:text-3xl font-bold capitalize'>
                    QuillDesk
                  </h1>
                </Link>

                <Button
                  variant={'default'}
                  type='button'
                  size={'icon'}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className='sr-only'>Close Menu</span>
                  <CgClose className='h-6 w-6 text-gray-600 dark:text-black' />
                </Button>
              </div>

              <div className='flex flex-col gap-4 w-full'>
                <span className='text-sm font-medium text-gray-400 uppercase tracking-wider'>
                  Manage
                </span>
                <div className='flex flex-col gap-2'>
                  {linksItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors duration-200`,
                        pathname === item.href
                          ? 'bg-gray-700 text-white'
                          : 'dark:text-gray-300 text-primary hover:text-white hover:bg-primary dark:hover:bg-gray-700'
                      )}
                    >
                      <span className='text-lg'>{item.icon}</span>
                      <span className='text-sm'>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className='flex flex-col gap-4'>
                <span className='text-sm font-medium text-gray-400 uppercase tracking-wider'>
                  Settings
                </span>
                <div className='flex flex-col gap-2'>
                  {settingsLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors duration-200`,
                        pathname === item.href
                          ? 'bg-gray-700 text-white'
                          : 'dark:text-gray-300 text-primary hover:text-white hover:bg-primary dark:hover:bg-gray-700'
                      )}
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
              type='button'
              variant={'ghost'}
              onClick={handleUserLogout}
              disabled={isLoggingOut}
              className='bg-transparent flex justify-start items-center gap-3 shadow-none hover:bg-primary hover:text-white text-primary dark:hover:bg-gray-700 dark:text-gray-300 mt-auto mb-8 lg:mb-0'
            >
              <span className='sr-only'>Logout</span>
              <BiLogOut />
              <span className='text-sm'>
                {isLoggingOut ? 'Logging Out...' : 'Logout'}
              </span>
            </Button>
          </div>
        </>
      )}
    </>
  )
}
