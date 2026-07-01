'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, List, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CartBadge from '@/components/shared/cart-badge'
import SearchBar from '@/components/shared/search-bar'
import Image from 'next/image'

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/wishlist', label: 'Wishlist' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="dark:bg-background/80 sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
            <ShoppingBag size={18} className="text-white" weight="fill" />
          </div>
          <span className="text-lg font-bold tracking-tight">Marketi</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <SearchBar />

          {session && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex"
            >
              <Link href="/wishlist">
                <Heart size={20} />
              </Link>
            </Button>
          )}

          <CartBadge />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-xs font-bold text-white">
                      {session.user.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="mb-1 border-b px-2 py-2">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">My Wishlist</Link>
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
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-linear-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} /> : <List size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white/95 backdrop-blur-md md:hidden">
          <nav className="container mx-auto flex flex-col space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="hover:bg-muted rounded-md px-4 py-3 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                  asChild
                >
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
