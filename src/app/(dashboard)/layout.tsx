'use client'

import NavMenu from '@/components/NavMenu'
import { AuthProvider } from '@/context/AuthContext'
import { NavigationProvider, useNavigation } from '@/context/NavigationContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useNavigation()

  return (
    <main className='flex min-h-screen'>
      <NavMenu />
      <div
        className={`
          flex-1 p-5 overflow-x-hidden md:p-5 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}
        `}
      >
        {children}
      </div>
    </main>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <NavigationProvider>
        <DashboardContent>{children}</DashboardContent>
      </NavigationProvider>
    </AuthProvider>
  )
}
