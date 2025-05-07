'use client'

import { Button } from '@/components/ui/button'
import { IoMoon, IoSunny } from 'react-icons/io5'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      className='w-9 h-9 rounded-full'
    >
      {theme === 'dark' ? (
        <IoSunny className='h-4 w-4' />
      ) : (
        <IoMoon className='h-4 w-4' />
      )}
    </Button>
  )
}
