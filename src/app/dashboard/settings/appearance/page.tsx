'use client'

import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function AppearancePage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [fontScale, setFontScale] = useState('normal')

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)

    // Load saved preferences
    const savedAnimations = localStorage.getItem('animationsEnabled')
    const savedMotion = localStorage.getItem('reducedMotion')
    const savedFontScale = localStorage.getItem('fontScale')

    if (savedAnimations !== null) {
      const enabled = savedAnimations === 'true'
      setAnimationsEnabled(enabled)
      document.documentElement.style.setProperty(
        '--animate-duration',
        enabled ? '0.2s' : '0s'
      )
    }

    if (savedMotion !== null) {
      const reduced = savedMotion === 'true'
      setReducedMotion(reduced)
      if (reduced) {
        document.documentElement.style.setProperty('--animate-duration', '0s')
      }
    }

    if (savedFontScale) {
      setFontScale(savedFontScale)
      document.documentElement.setAttribute('data-font-scale', savedFontScale)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className='m-auto w-full space-y-5 py-3'>
      <BreadcrumbNav />

      <div className='w-[98%] m-auto h-[calc(100vh-9rem)] bg-white dark:bg-background rounded-lg border dark:border-gray-700 p-5 space-y-5 overflow-y-auto scrollbar-hide'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Appearance</h2>
          <p className='text-muted-foreground'>
            Customize how the dashboard looks and feels
          </p>
        </div>

        <div className='space-y-5'>
          <Card className=''>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Select your preferred theme for the dashboard. System theme will
                automatically switch between light and dark themes based on your
                system preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className='grid grid-cols-3 gap-4'
              >
                <Label
                  htmlFor='light'
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground ${
                    theme === 'light'
                      ? 'border-primary'
                      : 'dark:border-gray-600'
                  } cursor-pointer`}
                >
                  <RadioGroupItem
                    value='light'
                    id='light'
                    className='sr-only'
                  />
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-6 w-6 mb-2'
                  >
                    <circle cx='12' cy='12' r='4' />
                    <path d='M12 2v2' />
                    <path d='M12 20v2' />
                    <path d='m4.93 4.93 1.41 1.41' />
                    <path d='m17.66 17.66 1.41 1.41' />
                    <path d='M2 12h2' />
                    <path d='M20 12h2' />
                    <path d='m6.34 17.66-1.41 1.41' />
                    <path d='m19.07 4.93-1.41 1.41' />
                  </svg>
                  <span className='text-sm font-medium'>Light</span>
                  {theme === 'light' && (
                    <span className='text-xs text-primary mt-1'>Active</span>
                  )}
                </Label>
                <Label
                  htmlFor='dark'
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground ${
                    theme === 'dark' ? 'border-primary' : 'dark:border-gray-600'
                  } cursor-pointer`}
                >
                  <RadioGroupItem value='dark' id='dark' className='sr-only' />
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-6 w-6 mb-2'
                  >
                    <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
                  </svg>
                  <span className='text-sm font-medium'>Dark</span>
                  {theme === 'dark' && (
                    <span className='text-xs text-primary mt-1'>Active</span>
                  )}
                </Label>
                <Label
                  htmlFor='system'
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground ${
                    theme === 'system'
                      ? 'border-primary'
                      : 'dark:border-gray-600'
                  } cursor-pointer`}
                >
                  <RadioGroupItem
                    value='system'
                    id='system'
                    className='sr-only'
                  />
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-6 w-6 mb-2'
                  >
                    <rect width='20' height='14' x='2' y='3' rx='2' />
                    <line x1='8' x2='16' y1='21' y2='21' />
                    <line x1='12' x2='12' y1='17' y2='21' />
                  </svg>
                  <span className='text-sm font-medium'>System</span>
                  {theme === 'system' && (
                    <span className='text-xs text-primary mt-1'>
                      {resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode
                    </span>
                  )}
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className=''>
            <CardHeader>
              <CardTitle>Animation & Motion</CardTitle>
              <CardDescription>
                Configure animation and motion preferences. These settings will
                be saved to your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='animations'>Enable animations</Label>
                  <p className='text-sm text-muted-foreground'>
                    Enable or disable animations globally
                  </p>
                </div>
                <Switch
                  id='animations'
                  checked={animationsEnabled}
                  onCheckedChange={(checked) => {
                    setAnimationsEnabled(checked)
                    localStorage.setItem('animationsEnabled', String(checked))
                    document.documentElement.style.setProperty(
                      '--animate-duration',
                      checked ? '0.2s' : '0s'
                    )
                  }}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label htmlFor='reduced-motion'>Reduced motion</Label>
                  <p className='text-sm text-muted-foreground'>
                    Prefer reduced motion when possible
                  </p>
                </div>
                <Switch
                  id='reduced-motion'
                  checked={reducedMotion}
                  onCheckedChange={(checked) => {
                    setReducedMotion(checked)
                    localStorage.setItem('reducedMotion', String(checked))
                    if (checked) {
                      document.documentElement.style.setProperty(
                        '--animate-duration',
                        '0s'
                      )
                    } else {
                      document.documentElement.style.setProperty(
                        '--animate-duration',
                        animationsEnabled ? '0.2s' : '0s'
                      )
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className=''>
            <CardHeader>
              <CardTitle>Font Scaling</CardTitle>
              <CardDescription>
                Adjust the size of text throughout the interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={fontScale}
                onValueChange={(value) => {
                  setFontScale(value)
                  localStorage.setItem('fontScale', value)
                  document.documentElement.setAttribute(
                    'data-font-scale',
                    value
                  )
                }}
                className='grid grid-cols-3 gap-4'
              >
                <Label
                  htmlFor='compact'
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground ${
                    fontScale === 'compact' ? 'border-primary' : ''
                  } cursor-pointer`}
                >
                  <RadioGroupItem
                    value='compact'
                    id='compact'
                    className='sr-only'
                  />
                  <span className='text-sm'>Aa</span>
                  <span className='text-sm font-medium mt-2'>Compact</span>
                </Label>
                <Label
                  htmlFor='normal'
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground ${
                    fontScale === 'normal' ? 'border-primary' : ''
                  } cursor-pointer`}
                >
                  <RadioGroupItem
                    value='normal'
                    id='normal'
                    className='sr-only'
                  />
                  <span className='text-base'>Aa</span>
                  <span className='text-sm font-medium mt-2'>Normal</span>
                </Label>
                <Label
                  htmlFor='large'
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground ${
                    fontScale === 'large' ? 'border-primary' : ''
                  } cursor-pointer`}
                >
                  <RadioGroupItem
                    value='large'
                    id='large'
                    className='sr-only'
                  />
                  <span className='text-lg'>Aa</span>
                  <span className='text-sm font-medium mt-2'>Large</span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
