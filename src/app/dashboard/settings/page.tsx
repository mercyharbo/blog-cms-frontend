'use client'

import { updateUserProfile } from '@/api/authReq'
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
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setUserProfile } from '@/store/features/userSlice'
import { useState } from 'react'
import { CiCamera } from 'react-icons/ci'
import { toast } from 'react-toastify'

export default function GeneralSettingsPage() {
  const dispatch = useAppDispatch()
  const { profile, loading: isLoading } = useAppSelector((state) => state.user)
  const [isUpdating, setIsUpdating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  /**
   * The `convertToBase64` function takes a File object as input and returns a Promise that resolves to
   * the base64 representation of the file.
   * @param {File} file - The `file` parameter in the `convertToBase64` function is of type `File`, which
   * represents a file from the user's system that can be read by the FileReader API.
   * @returns The `convertToBase64` function is returning a `Promise` that resolves to a base64 encoded
   * string representation of the input `File` object.
   */
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

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
        username: profile.profile.username,
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
      console.log(error)
      toast.error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * The function `handleImageChange` is used to handle the change event of an input element for
   * uploading an image, converting it to base64 format, and updating the user profile with the new
   * avatar URL.
   * @param e - The parameter `e` in the `handleImageChange` function is of type
   * `React.ChangeEvent<HTMLInputElement>`. This means it is an event object that represents a change in
   * an input element of type `file`. It is typically used to handle file uploads in React applications.
   * @returns If the `handleImageChange` function is called and successfully processes the image file
   * selected by the user, it will update the profile with the new `avatar_url` using the base64
   * representation of the image. If there is an error during the process, it will display a toast
   * message saying 'Failed to process image'.
   */
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
      console.log(error)
      toast.error('Failed to process image')
    }
  }

  if (isLoading) {
    return <PageLoadingSpinner />
  }

  return (
    <main className='space-y-5 m-auto w-full'>
      <BreadcrumbNav />

      <Card className='dark:bg-background dark:border-gray-700 m-auto h-[calc(100dvh-10rem)] w-[98%] overflow-y-auto scrollbar-hide'>
        <CardHeader className='flex flex-col items-start gap-1'>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Update your profile information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleProfileUpdate}
            className='flex flex-col gap-8 w-full'
          >
            <div className='relative w-24 h-24'>
              <Avatar className='w-24 h-24'>
                <AvatarImage
                  src={imagePreview || profile?.profile.avatar_url || ''}
                  className='object-cover'
                  alt='Profile Picture'
                />
                <AvatarFallback>{profile?.profile.first_name}</AvatarFallback>
              </Avatar>

              <label
                htmlFor='avatar-upload'
                className='absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow cursor-pointer hover:bg-white'
              >
                <CiCamera className='w-4 h-4 text-gray-700' />
              </label>

              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                disabled={isUpdating}
                onChange={handleImageChange}
              />
            </div>

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

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full'>
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
                <Label htmlFor='email'>Username</Label>
                <Input
                  id='username'
                  type='text'
                  value={profile?.profile.username || ''}
                  onChange={(e) =>
                    dispatch(
                      setUserProfile({
                        ...profile!,
                        profile: {
                          ...profile!.profile,
                          username: e.target.value,
                        },
                      })
                    )
                  }
                  disabled={isUpdating}
                  className='bg-gray-50'
                />
              </div>
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
                className='h-32'
              />
            </div>

            <Button type='submit' disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
