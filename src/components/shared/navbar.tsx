'use client'

import Link from 'next/link'
import {
  UserCircle,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CartBadge from '@/components/shared/cart-badge'
import SearchBar from '@/components/shared/search-bar'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Marketi
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/products"
            className="hover:text-primary transition-colors"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="hover:text-primary transition-colors"
          >
            Categories
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <SearchBar />

          <CartBadge />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                {session.user.role === 'ADMIN' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-destructive"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
