'use client'

import { getUserProfile, updateUserProfile } from '@/api/authReq'
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
import PageLoadingSpinner from '@/components/ui/PageLoadingSpinner'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  setError,
  setLoading,
  setUserProfile,
} from '@/store/features/userSlice'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function GeneralSettingsPage() {
  const dispatch = useAppDispatch()
  const { profile, loading: isLoading } = useAppSelector((state) => state.user)
  const [isUpdating, setIsUpdating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const getUserDetails = async () => {
    try {
      dispatch(setLoading(true))
      const data = await getUserProfile()
      console.log('User data:', data)
      if (data.user) {
        dispatch(setUserProfile(data.user))
      }
    } catch (error) {
      toast.error('Failed to load settings')
      console.error('Failed to load data:', error)
      dispatch(setError('Failed to load user profile'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      setIsUpdating(true)
      const profileData = {
        first_name: profile.profile.first_name,
        last_name: profile.profile.last_name,
        bio: profile.profile.bio,
        avatar_url: profile.profile.avatar_url || '',
      }

      const data = await updateUserProfile(profileData)

      if (data) {
        toast.success(data.message || 'Profile updated successfully')
        setTimeout(() => {
          window.location.reload()
        }, 5000)
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Profile update error:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const base64 = await convertToBase64(file)
      setImagePreview(base64)

      // Update the profile with the new avatar_url
      if (profile) {
        dispatch(
          setUserProfile({
            ...profile,
            profile: {
              ...profile.profile,
              avatar_url: base64,
            },
          })
        )
      }
    } catch (error) {
      toast.error('Failed to process image')
      console.error('Image processing error:', error)
    }
  }

  if (isLoading) {
    return <PageLoadingSpinner />
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
              <form
                onSubmit={handleProfileUpdate}
                className='flex flex-col gap-8 w-full'
              >
                <Avatar className='w-24 h-24'>
                  <AvatarImage
                    src={imagePreview || profile?.profile.avatar_url || ''}
                    className='object-cover'
                    alt='Profile Picture'
                  />
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
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
                  <Label htmlFor='bio'>Bio</Label>
                  <Textarea
                    id='bio'
                    rows={5}
                    placeholder='Tell us about yourself...'
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
                    disabled={isUpdating}
                    className='h-[8rem]'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='avatar'>Profile Picture</Label>
                  <Input
                    id='avatar'
                    type='file'
                    accept='image/*'
                    className='bg-gray-50'
                    disabled={isUpdating}
                    onChange={handleImageChange}
                  />
                </div>

                <Button type='submit' disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
