'use client'

import BreadcrumbNav from '@/components/ui/BreadcrumbNav'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import {
  generalService,
  type GeneralSettings,
  type UserProfile,
} from '@/services/general'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
]

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
]

export default function GeneralSettingsPage() {
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    bio: '',
  })
  const [settings, setSettings] = useState<GeneralSettings>({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    editorDefaults: {
      spellCheck: true,
      autoSave: true,
      autoSaveInterval: 30,
    },
    notifications: {
      browser: true,
      email: true,
    },
  })

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [profileData, settingsData] = await Promise.all([
          generalService.getProfile(),
          generalService.getGeneralSettings(),
        ])

        if (profileData.data) {
          setUserProfile(profileData.data)
        }
        if (settingsData.data) {
          setSettings(settingsData.data)
        }
      } catch (error) {
        toast.error('Failed to load settings')
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await generalService.updateProfile(userProfile)
      if (response.data) {
        setUserProfile(response.data)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingsUpdate = async (
    newSettings: Partial<GeneralSettings>
  ) => {
    try {
      setIsLoading(true)
      const updatedSettings = { ...settings, ...newSettings }
      const response = await generalService.updateGeneralSettings(
        updatedSettings
      )
      if (response.data) {
        setSettings(response.data)
        toast.success('Settings updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update settings')
      console.error('Settings update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const response = await generalService.updateAvatar(file)
      const avatarUrl = response?.data?.avatarUrl
      if (avatarUrl) {
        setUserProfile((prev) => ({ ...prev, avatar: avatarUrl }))
        toast.success('Avatar updated successfully')
      } else {
        throw new Error('No avatar URL received')
      }
    } catch (error) {
      toast.error('Failed to update avatar')
      console.error('Avatar update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='container max-w-4xl py-6 space-y-8'>
      <BreadcrumbNav />

      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            General Settings
          </h2>
          <p className='text-muted-foreground'>
            Manage your profile and preferences
          </p>
        </div>

        <Separator />

        {/* Profile Section */}
        <div className='grid gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                      id='firstName'
                      value={userProfile.firstName}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      id='lastName'
                      value={userProfile.lastName}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={userProfile.email}
                    onChange={(e) =>
                      setUserProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  <textarea
                    id='bio'
                    className='w-full min-h-[100px] px-3 py-2 rounded-md border'
                    value={userProfile.bio || ''}
                    onChange={(e) =>
                      setUserProfile((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='avatar'>Profile Picture</Label>
                  <Input
                    id='avatar'
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarUpload}
                    disabled={isLoading}
                  />
                </div>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>
                Set your preferred language, timezone, and date format
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <Label>Language</Label>
                <RadioGroup
                  value={settings.language}
                  onValueChange={(value) =>
                    handleSettingsUpdate({ language: value })
                  }
                  className='grid grid-cols-2 gap-4'
                >
                  {LANGUAGES.map((lang) => (
                    <div
                      key={lang.value}
                      className='flex items-center space-x-2'
                    >
                      <RadioGroupItem
                        value={lang.value}
                        id={`lang-${lang.value}`}
                      />
                      <Label htmlFor={`lang-${lang.value}`}>{lang.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className='space-y-4'>
                <Label>Timezone</Label>
                <select
                  className='w-full px-3 py-2 rounded-md border'
                  value={settings.timezone}
                  onChange={(e) =>
                    handleSettingsUpdate({ timezone: e.target.value })
                  }
                  disabled={isLoading}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='space-y-4'>
                <Label>Date Format</Label>
                <RadioGroup
                  value={settings.dateFormat}
                  onValueChange={(value) =>
                    handleSettingsUpdate({ dateFormat: value })
                  }
                  className='grid grid-cols-3 gap-4'
                >
                  {DATE_FORMATS.map((format) => (
                    <div
                      key={format.value}
                      className='flex items-center space-x-2'
                    >
                      <RadioGroupItem
                        value={format.value}
                        id={`format-${format.value}`}
                      />
                      <Label htmlFor={`format-${format.value}`}>
                        {format.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Editor Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Editor Preferences</CardTitle>
              <CardDescription>
                Configure your default editor settings
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>Spell Check</Label>
                  <p className='text-sm text-muted-foreground'>
                    Enable spell checking in the editor
                  </p>
                </div>
                <Switch
                  checked={settings.editorDefaults.spellCheck}
                  onCheckedChange={(checked) =>
                    handleSettingsUpdate({
                      editorDefaults: {
                        ...settings.editorDefaults,
                        spellCheck: checked,
                      },
                    })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>Auto Save</Label>
                  <p className='text-sm text-muted-foreground'>
                    Automatically save your work
                  </p>
                </div>
                <Switch
                  checked={settings.editorDefaults.autoSave}
                  onCheckedChange={(checked) =>
                    handleSettingsUpdate({
                      editorDefaults: {
                        ...settings.editorDefaults,
                        autoSave: checked,
                      },
                    })
                  }
                  disabled={isLoading}
                />
              </div>

              {settings.editorDefaults.autoSave && (
                <div className='space-y-2'>
                  <Label>Auto Save Interval (seconds)</Label>
                  <Input
                    type='number'
                    min={10}
                    max={300}
                    value={settings.editorDefaults.autoSaveInterval}
                    onChange={(e) =>
                      handleSettingsUpdate({
                        editorDefaults: {
                          ...settings.editorDefaults,
                          autoSaveInterval: parseInt(e.target.value, 10),
                        },
                      })
                    }
                    disabled={isLoading}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>Browser Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Show notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.browser}
                  onCheckedChange={(checked) =>
                    handleSettingsUpdate({
                      notifications: {
                        ...settings.notifications,
                        browser: checked,
                      },
                    })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>Email Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    handleSettingsUpdate({
                      notifications: {
                        ...settings.notifications,
                        email: checked,
                      },
                    })
                  }
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
