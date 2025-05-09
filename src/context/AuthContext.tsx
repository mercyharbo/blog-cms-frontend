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
    setIsAuthenticated(!!token)
    return !!token
  }, [cookies])

  const logout = useCallback(async () => {
    const response = await postUserLogout()
    if (response.success) {
      setIsAuthenticated(false)
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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
