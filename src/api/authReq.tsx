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

    const refreshTokenExpiry = new Date(data.session.expires_at * 1000)
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7)

    cookiestore.set('refresh_token', data.session.refresh_token, {
      expires: refreshTokenExpiry,
      secure: true,
      sameSite: 'strict',
    })
  }

  return data
}

export async function postUserLogout() {
  const cookiestore = new Cookies()

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

  // Clear cookies on logout
  if (data.success) {
    cookiestore.remove('access_token')
    cookiestore.remove('refresh_token')
  }

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
