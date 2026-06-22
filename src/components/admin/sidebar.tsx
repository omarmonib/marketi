'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SquaresFour,
  Package,
  ShoppingCart,
  Users,
  Tag,
  SignOut,
} from '@phosphor-icons/react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: SquaresFour },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-card flex min-h-screen w-64 flex-col border-r">
      <div className="border-b p-6">
        <Link href="/" className="text-lg font-bold">
          Marketi
        </Link>
        <p className="text-muted-foreground mt-1 text-xs">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-muted-foreground hover:text-destructive hover:bg-muted flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
        >
          <SignOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
