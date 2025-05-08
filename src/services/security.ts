import { fetchApi } from '@/lib/fetch'

export interface SecuritySettings {
  twoFactorEnabled: boolean
  emailNotifications: {
    loginAttempts: boolean
    passwordChanges: boolean
    newDevices: boolean
  }
}

export interface Session {
  id: string
  device: string
  browser: string
  location: string
  lastActive: string
  current: boolean
}

export interface LoginActivity {
  id: string
  timestamp: string
  success: boolean
  device: string
  browser: string
  location: string
  ipAddress: string
}

export const securityService = {
  // Password management
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi('/api/auth/change-password', {
      method: 'POST',
      requireAuth: true,
      body: { currentPassword, newPassword },
    }),

  // 2FA management
  toggleTwoFactor: (enabled: boolean) =>
    fetchApi('/api/auth/2fa/toggle', {
      method: 'POST',
      requireAuth: true,
      body: { enabled },
    }),

  setupTwoFactor: () =>
    fetchApi('/api/auth/2fa/setup', {
      method: 'POST',
      requireAuth: true,
    }),

  verifyTwoFactor: (code: string) =>
    fetchApi('/api/auth/2fa/verify', {
      method: 'POST',
      requireAuth: true,
      body: { code },
    }),

  // Session management
  getActiveSessions: () =>
    fetchApi<Session[]>('/api/auth/sessions', {
      method: 'GET',
      requireAuth: true,
    }),

  revokeSession: (sessionId: string) =>
    fetchApi('/api/auth/sessions/revoke', {
      method: 'POST',
      requireAuth: true,
      body: { sessionId },
    }),

  // Login history
  getLoginHistory: (page = 1, limit = 10) =>
    fetchApi<LoginActivity[]>('/api/auth/activity', {
      method: 'GET',
      requireAuth: true,
      body: { page, limit },
    }),

  // Security settings
  getSecuritySettings: () =>
    fetchApi<SecuritySettings>('/api/auth/security/settings', {
      method: 'GET',
      requireAuth: true,
    }),

  updateSecuritySettings: (settings: Partial<SecuritySettings>) =>
    fetchApi<SecuritySettings>('/api/auth/security/settings', {
      method: 'PATCH',
      requireAuth: true,
      body: settings,
    }),
}
