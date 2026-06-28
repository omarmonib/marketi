'use client'

import { useState, useTransition } from 'react'
import { validateCoupon } from '@/actions/coupons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tag, X } from '@phosphor-icons/react'

type CouponResult = {
  coupon: { id: string; code: string; type: string; value: number }
  discount: number
}

type Props = {
  orderTotal: number
  onApply: (result: CouponResult) => void
  onRemove: () => void
  applied: CouponResult | null
}

export default function CouponInput({
  orderTotal,
  onApply,
  onRemove,
  applied,
}: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleApply() {
    if (!code.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await validateCoupon(code.trim(), orderTotal)
      if ('error' in result) {
        setError(result.error ?? 'Something went wrong')
      } else {
        onApply(result)
        setCode('')
      }
    })
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-md border border-green-300 bg-green-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-700">
            {applied.coupon.code}
          </span>
          <span className="text-xs text-green-600">
            -
            {applied.coupon.type === 'PERCENTAGE'
              ? `${applied.coupon.value}%`
              : `$${applied.coupon.value}`}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-green-600 hover:text-green-800"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={isPending || !code.trim()}
        >
          {isPending ? 'Checking...' : 'Apply'}
        </Button>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
