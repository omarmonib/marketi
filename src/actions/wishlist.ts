'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(productId: string) {
  const session = await auth()
  if (!session) return { error: 'You must be logged in' }

  const existing = await db.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  })

  if (existing) {
    await db.wishlist.delete({ where: { id: existing.id } })
    revalidatePath('/wishlist')
    return { saved: false }
  } else {
    await db.wishlist.create({
      data: { userId: session.user.id, productId },
    })
    revalidatePath('/wishlist')
    return { saved: true }
  }
}
