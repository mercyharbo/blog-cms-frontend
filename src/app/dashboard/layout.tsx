'use client'

import NavHeaderComp from '@/components/nav-header'
import NavMenu from '@/components/NavMenu'
import { AuthProvider } from '@/context/AuthContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <main className='h-screen flex overflow-hidden dark:bg-primary-foreground'>
      <NavMenu />
      <div className='flex flex-1 flex-col min-w-0'>
        <NavHeaderComp />
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
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  )
}
