'use client'

import { useNavigation } from '@/context/NavigationContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BiCategory } from 'react-icons/bi'
import { FaUsers } from 'react-icons/fa'
import {
  IoCloseOutline,
  IoColorPalette,
  IoDocumentTextOutline,
  IoMenuOutline,
  IoSettings,
  IoShieldOutline,
} from 'react-icons/io5'
import {
  MdArticle,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'

const linksItems = [
  { href: '/posts', label: 'Posts', icon: <MdArticle /> },
  { href: '/categories', label: 'Categories', icon: <BiCategory /> },
  { href: '/authors', label: 'Authors', icon: <FaUsers /> },
  {
    href: '/content-types',
    label: 'Content Types',
    icon: <IoDocumentTextOutline />,
  },
]

const settingsLinks = [
  {
    href: '/settings/general',
    label: 'General Settings',
    icon: <IoSettings />,
  },
  {
    href: '/settings/appearance',
    label: 'Appearance',
    icon: <IoColorPalette />,
  },
  { href: '/settings/security', label: 'Security', icon: <IoShieldOutline /> },
]

export default function NavMenu() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed } = useNavigation()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className='lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-700 text-white'
      >
        {isOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
      </button>

      <nav
        className={`
        flex flex-col h-screen bg-gray-800 text-white p-6 fixed top-0 left-0 
        ${isCollapsed ? 'w-20 lg:w-20 collapsed' : 'w-[280px] lg:w-1/5'}
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-40
      `}
      >
        {/* Logo Section */}
        <div className='flex items-center justify-between mb-8'>
          <Link href={'/'}>
            <h1
              className={`text-2xl lg:text-3xl font-bold capitalize ${
                isCollapsed ? 'hidden' : 'block'
              }`}
            >
              logo
            </h1>
          </Link>

          {/* Collapse button - only shown on desktop */}
          <button
            onClick={toggleCollapse}
            className='hidden lg:block p-2 hover:bg-gray-700 rounded-md'
          >
            {isCollapsed ? (
              <MdKeyboardDoubleArrowRight size={24} />
            ) : (
              <MdKeyboardDoubleArrowLeft size={24} />
            )}
          </button>

          {/* Mobile close button */}
          <button onClick={toggleMenu} className='lg:hidden p-2 -mr-2'>
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Main Navigation Section */}
        <div className='flex-1 flex flex-col gap-8'>
          {/* Manage Section */}
          <div className='flex flex-col gap-4'>
            <span
              className={`text-sm font-medium text-gray-400 uppercase tracking-wider ${
                isCollapsed ? 'hidden' : 'block'
              }`}
            >
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
                  } transition-colors duration-200 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className='text-lg'>{item.icon}</span>
                  <span
                    className={`text-sm ${isCollapsed ? 'hidden' : 'block'}`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Settings Section */}
          <div className='flex flex-col gap-4'>
            <span
              className={`text-sm font-medium text-gray-400 uppercase tracking-wider ${
                isCollapsed ? 'hidden' : 'block'
              }`}
            >
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
                  } transition-colors duration-200 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className='text-lg'>{item.icon}</span>
                  <span
                    className={`text-sm ${isCollapsed ? 'hidden' : 'block'}`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Section - Fixed at Bottom */}
        <div
          className={`mt-auto pt-4 border-t border-gray-700 ${
            isCollapsed ? 'items-center' : ''
          }`}
        >
          <div
            className={`flex items-center gap-3 p-2 rounded-md ${
              isCollapsed ? 'justify-center ' : ''
            }`}
          >
            <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center'>
              <FaUsers className='text-lg' />
            </div>
            <div
              className={`flex flex-col ${isCollapsed ? 'hidden' : 'block'}`}
            >
              <span className='text-sm font-medium'>John Doe</span>
              <span className='text-xs text-gray-400'>john@example.com</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 bg-opacity-50 lg:hidden z-30'
          onClick={toggleMenu}
        />
      )}
    </>
  )
}
