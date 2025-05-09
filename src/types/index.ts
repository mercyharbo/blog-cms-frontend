// src/types/index.ts

export interface MenuItemProps {
  label: string
  link: string
}

export interface SignupData {
  email: string
  password: string
  username?: string
}

export interface SignupResponse {
  message: string
  user: {
    id: string
    email: string
  }
}

export interface Session {
  access_token: string
  expires_at: number
}

export interface AuthToken {
  token: string | null
  isAuthenticated: boolean
}
