'use client'

import { getUserProfile } from '@/api/authReq'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  setError,
  setLoading,
  setUserProfile,
} from '@/store/features/userSlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

// const TIMEZONES = [
//   { value: 'UTC', label: 'UTC' },
//   { value: 'America/New_York', label: 'Eastern Time' },
//   { value: 'America/Chicago', label: 'Central Time' },
//   { value: 'America/Denver', label: 'Mountain Time' },
//   { value: 'America/Los_Angeles', label: 'Pacific Time' },
//   { value: 'Europe/London', label: 'London' },
//   { value: 'Europe/Paris', label: 'Paris' },
//   { value: 'Asia/Tokyo', label: 'Tokyo' },
// ]

// const DATE_FORMATS = [
//   { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
//   { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
//   { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
// ]

// const LANGUAGES = [
//   { value: 'en', label: 'English' },
//   { value: 'es', label: 'Español' },
//   { value: 'fr', label: 'Français' },
//   { value: 'de', label: 'Deutsch' },
// ]

export default function GeneralSettingsPage() {
  // const { isAuthenticated } = useAuth()
  const dispatch = useAppDispatch()
  const { profile, loading: isLoading } = useAppSelector((state) => state.user)
  // const [settings, setSettings] = useState<GeneralSettings>({
  //   language: 'en',
  //   timezone: 'UTC',
  //   dateFormat: 'MM/DD/YYYY',
  //   editorDefaults: {
  //     spellCheck: true,
  //     autoSave: true,
  //     autoSaveInterval: 30,
  //   },
  //   notifications: {
  //     browser: true,
  //     email: true,
  //   },
  // })

  const getUserDetails = async () => {
    try {
      dispatch(setLoading(true))
      const { user } = await getUserProfile()
      if (user) {
        dispatch(setUserProfile(user))
      }
    } catch (error) {
      toast.error('Failed to load settings')
      console.error('Failed to load data:', error)
      dispatch(setError('Failed to load user profile'))
    }
  }

  useEffect(() => {
    getUserDetails()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // const handleSettingsUpdate = async (
  //   newSettings: Partial<GeneralSettings>
  // ) => {
  //   try {
  //     dispatch(setLoading(true))
  //     const response = await generalService.updateGeneralSettings({
  //       ...settings,
  //       ...newSettings,
  //     })
  //     if (response.data) {
  //       setSettings(response.data)
  //       toast.success('Settings updated successfully')
  //     }
  //   } catch (error) {
  //     toast.error('Failed to update settings')
  //     console.error('Settings update error:', error)
  //   } finally {
  //     dispatch(setLoading(false))
  //   }
  // }

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
              <form
                // onSubmit={handleProfileUpdate}
                className='flex flex-col gap-8 w-full'
              >
                <Avatar className='w-24 h-24'>
                  <AvatarImage src={profile?.profile.avatar_url || ''} />
                  <AvatarFallback>{profile?.profile.first_name}</AvatarFallback>
                </Avatar>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                      id='firstName'
                      value={profile?.profile.first_name || ''}
                      onChange={(e) =>
                        dispatch(
                          setUserProfile({
                            ...profile!,
                            profile: {
                              ...profile!.profile,
                              first_name: e.target.value,
                            },
                          })
                        )
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      id='lastName'
                      value={profile?.profile.last_name || ''}
                      onChange={(e) =>
                        dispatch(
                          setUserProfile({
                            ...profile!,
                            profile: {
                              ...profile!.profile,
                              last_name: e.target.value,
                            },
                          })
                        )
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
                    value={profile?.email || ''}
                    disabled={true}
                    className='bg-gray-50'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone</Label>
                  <Input
                    id='phone'
                    type='tel'
                    value={profile?.phone || ''}
                    onChange={(e) =>
                      dispatch(
                        setUserProfile({ ...profile!, phone: e.target.value })
                      )
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  <Textarea
                    id='bio'
                    rows={5}
                    onChange={(e) =>
                      dispatch(
                        setUserProfile({
                          ...profile!,
                          profile: {
                            ...profile!.profile,
                            bio: e.target.value,
                          },
                        })
                      )
                    }
                    value={profile?.profile.bio || ''}
                    disabled={isLoading}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='avatar'>Profile Picture</Label>
                  <Input
                    id='avatar'
                    type='file'
                    accept='image/*'
                    className='bg-gray-50'
                    disabled={isLoading}
                  />
                </div>

                <Button type='submit' disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
