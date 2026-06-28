'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  body: z.string().min(10, 'Review must be at least 10 characters'),
})

export async function createReview(productId: string, values: unknown) {
  const session = await auth()
  if (!session) return { error: 'You must be logged in to leave a review' }

  const validated = ReviewSchema.safeParse(values)
  if (!validated.success) return { error: 'Invalid fields' }

  // Check user has actually purchased this product
  const hasPurchased = await db.order.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] },
      items: { some: { productId } },
    },
  })

  if (!hasPurchased) {
    return { error: 'You can only review products you have purchased' }
  }

  // Check user hasn't already reviewed this product
  const existing = await db.review.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  })

  if (existing) return { error: 'You have already reviewed this product' }

  await db.review.create({
    data: {
      userId: session.user.id,
      productId,
      ...validated.data,
    },
  })

  revalidatePath(`/products`)
  return { success: 'Review submitted!' }
}

export async function deleteReview(reviewId: string, productSlug: string) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const review = await db.review.findUnique({ where: { id: reviewId } })
  if (!review) return { error: 'Review not found' }

  // Only the author or an admin can delete
  if (review.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  await db.review.delete({ where: { id: reviewId } })
  revalidatePath(`/products/${productSlug}`)
  return { success: 'Review deleted' }
}
