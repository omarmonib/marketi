import Navbar from '@/components/shared/navbar'
import { SessionProvider } from 'next-auth/react'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="text-muted-foreground border-t py-6 text-center text-sm">
          © {new Date().getFullYear()} Marketi. All rights reserved.
        </footer>
      </div>
    </SessionProvider>
  )
}
