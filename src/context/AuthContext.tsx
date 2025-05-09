'use client'

import { postUserLogout } from '@/api/authReq'
import { useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Cookies from 'universal-cookie'

interface AuthContextType {
  isAuthenticated: boolean
  logout: () => Promise<void>
  checkAuth: () => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const cookies = useMemo(() => new Cookies(), [])

  const checkAuth = useCallback(() => {
    const token = cookies.get('access_token')
    if (!token) {
      setIsAuthenticated(false)
      cookies.remove('access_token')
      router.replace('/')
      return false
    }
    setIsAuthenticated(true)
    return true
  }, [cookies, router])

  const logout = useCallback(async () => {
    try {
      await postUserLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      cookies.remove('access_token')
      setIsAuthenticated(false)
      router.replace('/')
    }
  }, [cookies, router])

  // Check authentication status on mount and when location changes
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Listen for token expiration or removal
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && !e.newValue) {
        setIsAuthenticated(false)
        router.replace('/')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
