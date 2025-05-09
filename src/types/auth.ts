export interface LoginResponse {
  message: string
  session: {
    access_token: string
    expires_in: number
    expires_at: number
  }
  user: {
    email: string
    id: string
  }
}

export interface UserIdentity {
  identity_id: string
  id: string
  user_id: string
  identity_data: {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
  }
  provider: string
  last_sign_in_at: string
  created_at: string
  updated_at: string
  email: string
}

export interface UserProfile {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string
  phone: string
  confirmation_sent_at: string
  confirmed_at: string
  last_sign_in_at: string
  app_metadata: {
    provider: string
    providers: string[]
  }
  user_metadata: {
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
  }
  identities: UserIdentity[]
  created_at: string
  updated_at: string
  is_anonymous: boolean
  profile: {
    first_name: string
    last_name: string
    avatar_url: string | null
    bio: string | null
  }
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  loading: boolean
  error: string | null
}
