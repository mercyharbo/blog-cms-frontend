'use client'

import NavMenu from '@/components/NavMenu'
import { AuthProvider } from '@/context/AuthContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex h-screen w-full overflow-hidden dark:bg-background'>
      <NavMenu />
      <div className='p-5 absolute w-full lg:w-[80%] lg:top-0 lg:right-0'>
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
