import { AuthToken } from '@/types'
import { useEffect, useState } from 'react'
import Cookies from 'universal-cookie'

export const getUserToken = (): AuthToken => {
  const cookies = new Cookies()
  const [token, setToken] = useState<string | null>(null)

  // Check for token on mount and cookie changes
  useEffect(() => {
    const accessToken = cookies.get('access_token')
    setToken(accessToken || null)
  }, [])

  const getToken = (): string | null => {
    return cookies.get('access_token') || null
  }

  const removeToken = (): void => {
    cookies.remove('access_token', { path: '/' })
    cookies.remove('refresh_token', { path: '/' })
    setToken(null)
  }

  return {
    token,
    isAuthenticated: !!token,
    getToken,
    removeToken,
  }
}
