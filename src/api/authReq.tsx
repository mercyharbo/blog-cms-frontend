import { fetchApi } from '@/lib/fetch'
import { UserProfile } from '@/types/auth'
import Cookies from 'universal-cookie'

export async function postUserLogin(email: string, password: string) {
  const cookiestore = new Cookies()
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to login')
  }

  if (data.session) {
    cookiestore.set('access_token', data.session.access_token, {
      expires: new Date(data.session.expires_at * 1000),
      secure: true,
      sameSite: 'strict',
    })
  }

  return data
}

export async function postUserLogout() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${new Cookies().get('access_token')}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to logout')
  }

  return response.json()
}

export async function postUserRegister(email: string, password: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to register')
  }

  return data
}

export async function postUserForgotPassword(email: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to process forgot password request')
  }

  return data
}

export async function postUserResetPassword(
  token: string,
  newPassword: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to reset password')
  }

  return data
}

export async function getUserProfile() {
  return fetchApi('/api/auth/me', {
    method: 'GET',
    requireAuth: true,
  })
}

export async function updateUserProfile(
  profile: Pick<
    UserProfile['profile'],
    'first_name' | 'last_name' | 'bio' | 'avatar_url'
  >
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${new Cookies().get('access_token')}`,
      },
      body: JSON.stringify(profile),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update profile')
  }

  return data
}
