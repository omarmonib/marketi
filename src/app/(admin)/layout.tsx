import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/sidebar'
import { SessionProvider } from 'next-auth/react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="bg-muted/20 flex-1 p-8">{children}</main>
      </div>
    </SessionProvider>
  )
}
