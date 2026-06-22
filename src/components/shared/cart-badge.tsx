'use client'

import Link from 'next/link'
import { ShoppingCartSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { useSyncExternalStore } from 'react'

export default function CartBadge() {
  const count = useSyncExternalStore(
    useCartStore.subscribe,
    () =>
      useCartStore
        .getState()
        .items.reduce((sum, item) => sum + item.quantity, 0),
    () => 0
  )

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart">
        <ShoppingCartSimple size={20} />
        {count > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Link>
    </Button>
  )
}
