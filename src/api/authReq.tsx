import { LoginResponse } from '@/types/auth'
import Cookies from 'universal-cookie'

export async function postUserLogin(email: string, password: string) {
  const cookiestore = new Cookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data: LoginResponse = await res.json()

  // Set cookies if login is successful
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  )

  const data = await res.json()

  return data
}

export async function postUserRegister(email: string, password: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  )

  const data = await res.json()

  return data
}

export async function postUserForgotPassword(email: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    }
  )

  const data = await res.json()

  return data
}

export async function postUserResetPassword(
  token: string,
  newPassword: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    }
  )

  const data = await res.json()

  return data
}

export async function getUserProfile() {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch content types')
  }

  return data
}

export async function updateUserProfile(profile: any) {
  const cookie_store = new Cookies()
  const access_token = cookie_store.get('access_token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(profile),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update user profile')
  }

  return data
}
