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
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import {
  securityService,
  type LoginActivity,
  type Session,
} from '@/services/security'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function SecurityPage() {
  const { isAuthenticated } = useAuth()
  const [activeSessions, setActiveSessions] = useState<Session[]>([])
  const [loginHistory, setLoginHistory] = useState<LoginActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: {
      loginAttempts: true,
      passwordChanges: true,
      newDevices: true,
    },
  })

  // Password states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Load initial data
  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setIsLoading(true)
        const [settings, sessions, history] = await Promise.all([
          securityService.getSecuritySettings(),
          securityService.getActiveSessions(),
          securityService.getLoginHistory(),
        ])

        if (settings.data) {
          setSecuritySettings(settings.data)
        }
        if (sessions.data) {
          setActiveSessions(sessions.data)
        }
        if (history.data) {
          setLoginHistory(history.data)
        }
      } catch (error) {
        toast.error('Failed to load security settings')
        console.error('Failed to load security data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadSecurityData()
    }
  }, [isAuthenticated])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      setIsLoading(true)
      await securityService.changePassword(currentPassword, newPassword)
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Failed to update password')
      console.error('Password change error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTwoFactor = async (enabled: boolean) => {
    try {
      setIsLoading(true)
      if (enabled) {
        await securityService.setupTwoFactor()
        // TODO: Show QR code modal for 2FA setup
        toast.info('2FA setup required')
      } else {
        await securityService.toggleTwoFactor(false)
        toast.success('2FA disabled')
      }

      setSecuritySettings((prev) => ({
        ...prev,
        twoFactorEnabled: enabled,
      }))
    } catch (error) {
      toast.error('Failed to update 2FA settings')
      console.error('2FA toggle error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationToggle = async (
    key: keyof typeof securitySettings.emailNotifications
  ) => {
    try {
      setIsLoading(true)
      const newSettings = {
        ...securitySettings,
        emailNotifications: {
          ...securitySettings.emailNotifications,
          [key]: !securitySettings.emailNotifications[key],
        },
      }

      await securityService.updateSecuritySettings(newSettings)
      setSecuritySettings(newSettings)
      toast.success('Notification settings updated')
    } catch (error) {
      toast.error('Failed to update notification settings')
      console.error('Notification settings error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setIsLoading(true)
      await securityService.revokeSession(sessionId)
      setActiveSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      )
      toast.success('Session revoked successfully')
    } catch (error) {
      toast.error('Failed to revoke session')
      console.error('Session revoke error:', error)
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
                  <Label htmlFor='currentPassword'>Current Password</Label>
                  <Input
                    id='currentPassword'
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='newPassword'>New Password</Label>
                  <Input
                    id='newPassword'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type='submit' disabled={isLoading}>
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
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={toggleTwoFactor}
                  disabled={isLoading}
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
                  checked={securitySettings.emailNotifications.loginAttempts}
                  onCheckedChange={() =>
                    handleNotificationToggle('loginAttempts')
                  }
                  disabled={isLoading}
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
                  checked={securitySettings.emailNotifications.passwordChanges}
                  onCheckedChange={() =>
                    handleNotificationToggle('passwordChanges')
                  }
                  disabled={isLoading}
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
                  checked={securitySettings.emailNotifications.newDevices}
                  onCheckedChange={() => handleNotificationToggle('newDevices')}
                  disabled={isLoading}
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
              <div className='space-y-4'>
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
              </div>
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
              <div className='space-y-4'>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
