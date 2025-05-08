'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { IoMoon, IoSunny } from 'react-icons/io5'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='w-9 h-9 rounded-full'>
        <IoSunny className='h-4 w-4 transition-all' />
      </Button>
    )
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='w-9 h-9 rounded-full'
    >
      {theme === 'dark' ? (
        <IoSunny className='h-4 w-4 transition-all' />
      ) : (
        <IoMoon className='h-4 w-4 transition-all' />
      )}
    </Button>
  )
}
