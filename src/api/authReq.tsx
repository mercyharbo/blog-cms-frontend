import { fetchApi } from '@/lib/fetch'
import { LoginResponse, UserProfile } from '@/types/auth'
import Cookies from 'universal-cookie'

export async function postUserLogin(email: string, password: string) {
  const cookiestore = new Cookies()
  const data = await fetchApi<
    LoginResponse,
    unknown,
    Pick<UserProfile, 'id' | 'email'>
  >('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

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
  return fetchApi('/api/auth/logout', {
    method: 'POST',
  })
}

export async function postUserRegister(email: string, password: string) {
  return fetchApi('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function postUserForgotPassword(email: string) {
  return fetchApi('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function postUserResetPassword(
  token: string,
  newPassword: string
) {
  return fetchApi('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  })
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
  return fetchApi<{ message: string }>('/api/auth/profile', {
    method: 'PUT',
    requireAuth: true,
    body: JSON.stringify(profile),
  })
}
