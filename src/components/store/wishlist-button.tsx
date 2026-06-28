'use client'

import { useState, useTransition } from 'react'
import { Heart } from '@phosphor-icons/react'
import { toggleWishlist } from '@/actions/wishlist'
import { useRouter } from 'next/navigation'

type Props = {
  productId: string
  initialSaved: boolean
  isLoggedIn: boolean
}

export default function WishlistButton({
  productId,
  initialSaved,
  isLoggedIn,
}: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleToggle() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    setSaved((prev) => !prev) // optimistic update
    startTransition(async () => {
      const result = await toggleWishlist(productId)
      if (result?.error) setSaved((prev) => !prev) // revert on error
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="hover:bg-muted flex items-center justify-center rounded-full p-1.5 transition-colors disabled:opacity-50"
      title={saved ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={20}
        weight={saved ? 'fill' : 'regular'}
        className={saved ? 'text-red-500' : 'text-muted-foreground'}
      />
    </button>
  )
}
