'use client'

import { changePassword } from '@/api/authReq'
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
import { Switch } from '@/components/ui/switch'

import { useState } from 'react'
import { toast } from 'react-toastify'

export default function SecurityPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await changePassword(currentPassword, newPassword)
      if (response.status === true) {
        toast.success(response.message)
        setTimeout(() => {
          window.location.reload()
        }, 5000)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='py-5 m-auto w-full space-y-5'>
      <BreadcrumbNav />

      <div className='w-[98%] m-auto h-[calc(100vh-9rem)] bg-white dark:bg-background rounded-lg border dark:border-gray-700 p-5 space-y-5 overflow-y-auto scrollbar-hide'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Security Settings
          </h2>
          <p className='text-muted-foreground'>
            Manage your account security settings and preferences
          </p>
        </div>

        <Separator />

        <div className='grid gap-6'>
          {/* Password Change Section */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to maintain account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='current_password'>Current Password</Label>
                  <Input
                    id='current_password'
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='new_password'>New Password</Label>
                  <Input
                    id='new_password'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type='submit'
                  disabled={isLoading}
                  variant='default'
                  size='lg'
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>Two-Factor Authentication</Label>
                  <p className='text-sm text-muted-foreground'>
                    Require a verification code when signing in
                  </p>
                </div>
                <Switch
                //   checked={securitySettings.twoFactorEnabled}
                //   onCheckedChange={toggleTwoFactor}
                //   disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Security Notifications</CardTitle>
              <CardDescription>
                Choose which security events you want to be notified about
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>Login Attempts</Label>
                  <p className='text-sm text-muted-foreground'>
                    Get notified of unsuccessful login attempts
                  </p>
                </div>
                <Switch
                //   checked={securitySettings.emailNotifications.loginAttempts}
                //   onCheckedChange={() =>
                //     handleNotificationToggle('loginAttempts')
                //   }
                //   disabled={isLoading}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>Password Changes</Label>
                  <p className='text-sm text-muted-foreground'>
                    Get notified when your password is changed
                  </p>
                </div>
                <Switch
                //   checked={securitySettings.emailNotifications.passwordChanges}
                //   onCheckedChange={() =>
                //     handleNotificationToggle('passwordChanges')
                //   }
                //   disabled={isLoading}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <Label>New Devices</Label>
                  <p className='text-sm text-muted-foreground'>
                    Get notified when your account is accessed from a new device
                  </p>
                </div>
                <Switch
                //   checked={securitySettings.emailNotifications.newDevices}
                //   onCheckedChange={() => handleNotificationToggle('newDevices')}
                //   disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices and locations where you&apos;re currently signed
                in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className='space-y-4'>
                {activeSessions.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No active sessions found
                  </p>
                ) : (
                  <div className='space-y-4'>
                    {activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className='flex items-center justify-between p-4 border rounded-lg'
                      >
                        <div className='space-y-1'>
                          <p className='font-medium'>{session.device}</p>
                          <p className='text-sm text-muted-foreground'>
                            {session.browser} • {session.location}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Last active: {session.lastActive}
                          </p>
                        </div>
                        {!session.current && (
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => handleRevokeSession(session.id)}
                            disabled={isLoading}
                          >
                            Revoke
                          </Button>
                        )}
                        {session.current && (
                          <span className='text-xs font-medium text-primary'>
                            Current Session
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div> */}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Review recent account activity and login attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className='space-y-4'>
                {loginHistory.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No recent activity found
                  </p>
                ) : (
                  <div className='space-y-4'>
                    {loginHistory.map((activity) => (
                      <div
                        key={activity.id}
                        className='flex items-center justify-between p-4 border rounded-lg'
                      >
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <p className='font-medium'>{activity.device}</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                activity.success
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {activity.success ? 'Success' : 'Failed'}
                            </span>
                          </div>
                          <p className='text-sm text-muted-foreground'>
                            {activity.browser} • {activity.location}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {activity.timestamp} • IP: {activity.ipAddress}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
