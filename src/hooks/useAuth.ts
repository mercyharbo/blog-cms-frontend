import { useEffect, useMemo, useState } from 'react'
import Cookies from 'universal-cookie'

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const cookies = useMemo(() => new Cookies(), [])

  useEffect(() => {
    const userToken = cookies.get('token') || null
    setToken(userToken)
  }, [cookies])

  const updateToken = () => {
    const userToken = cookies.get('token') || null
    setToken(userToken)
  }

  return {
    token,
    isAuthenticated: !!token,
    updateToken,
  }
}
