'use client'

import NavMenu from '@/components/NavMenu'
import { AuthProvider } from '@/context/AuthContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex h-screen w-full overflow-hidden bg-gray-50'>
      <NavMenu />
      <div className='flex-1 overflow-auto p-6'>{children}</div>
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
