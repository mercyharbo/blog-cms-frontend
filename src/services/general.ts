import { fetchApi } from '@/lib/fetch'

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  bio?: string
  role: string
}

export interface GeneralSettings {
  language: string
  timezone: string
  dateFormat: string
  editorDefaults: {
    spellCheck: boolean
    autoSave: boolean
    autoSaveInterval: number
  }
  notifications: {
    browser: boolean
    email: boolean
  }
}

export const generalService = {
  // Profile management
  getProfile: () =>
    fetchApi<UserProfile>('/api/user/profile', {
      method: 'GET',
      requireAuth: true,
    }),

  updateProfile: (profile: Partial<UserProfile>) =>
    fetchApi<UserProfile>('/api/user/profile', {
      method: 'PATCH',
      requireAuth: true,
      body: profile,
    }),

  updateAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return fetchApi<{ avatarUrl: string }>('/api/user/avatar', {
      method: 'POST',
      requireAuth: true,
      body: formData,
    })
  },

  // General settings
  getGeneralSettings: () =>
    fetchApi<GeneralSettings>('/api/user/settings', {
      method: 'GET',
      requireAuth: true,
    }),

  updateGeneralSettings: (settings: Partial<GeneralSettings>) =>
    fetchApi<GeneralSettings>('/api/user/settings', {
      method: 'PATCH',
      requireAuth: true,
      body: settings,
    }),
}
