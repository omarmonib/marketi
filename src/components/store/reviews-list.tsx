'use client'

import { useTransition } from 'react'
import { deleteReview } from '@/actions/reviews'
import StarRating from '@/components/shared/star-rating'
import { Button } from '@/components/ui/button'
import { Trash } from '@phosphor-icons/react'

type Review = {
  id: string
  rating: number
  title: string
  body: string
  createdAt: Date
  user: { id: string; name: string | null }
}

type Props = {
  reviews: Review[]
  productSlug: string
  currentUserId?: string
  isAdmin?: boolean
}

export default function ReviewsList({
  reviews,
  productSlug,
  currentUserId,
  isAdmin,
}: Props) {
  const [isPending, startTransition] = useTransition()

  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No reviews yet. Be the first to review this product!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-card space-y-2 rounded-lg border p-4"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <StarRating value={review.rating} readonly size={16} />
              <p className="text-sm font-medium">{review.title}</p>
            </div>
            {(currentUserId === review.user.id || isAdmin) && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteReview(review.id, productSlug)
                  })
                }
              >
                <Trash size={14} />
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{review.body}</p>
          <p className="text-muted-foreground text-xs">
            {review.user.name ?? 'Anonymous'} ·{' '}
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      ))}
    </div>
  )
}
