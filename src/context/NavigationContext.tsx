'use client'

import { createContext, useContext, useState } from 'react'

type NavigationContextType = {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
)

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <NavigationContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
