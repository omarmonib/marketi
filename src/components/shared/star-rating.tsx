'use client'

import { useState } from 'react'
import { Star } from '@phosphor-icons/react'

type Props = {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: number
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 20,
}: Props) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className="disabled:cursor-default"
        >
          <Star
            size={size}
            weight={star <= (hovered || value) ? 'fill' : 'regular'}
            className={
              star <= (hovered || value)
                ? 'text-yellow-400'
                : 'text-muted-foreground'
            }
          />
        </button>
      ))}
    </div>
  )
}
