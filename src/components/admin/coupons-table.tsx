'use client'

import { useTransition } from 'react'
import { deleteCoupon, toggleCoupon } from '@/actions/coupons'
import { Button } from '@/components/ui/button'
import { Trash } from '@phosphor-icons/react'
import { CouponType } from '@prisma/client'

type Coupon = {
  id: string
  code: string
  type: CouponType
  value: number
  minOrder: number | null
  maxUses: number | null
  uses: number
  active: boolean
  expiresAt: Date | null
  createdAt: Date
}

export default function AdminCouponsTable({ coupons }: { coupons: Coupon[] }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="bg-card overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="p-4 text-left font-medium">Code</th>
            <th className="p-4 text-left font-medium">Type</th>
            <th className="p-4 text-left font-medium">Value</th>
            <th className="p-4 text-left font-medium">Min Order</th>
            <th className="p-4 text-left font-medium">Uses</th>
            <th className="p-4 text-left font-medium">Expires</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {coupons.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-muted-foreground p-8 text-center">
                No coupons yet
              </td>
            </tr>
          ) : (
            coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="p-4 font-mono font-bold">{coupon.code}</td>
                <td className="text-muted-foreground p-4">{coupon.type}</td>
                <td className="p-4 font-medium">
                  {coupon.type === 'PERCENTAGE'
                    ? `${coupon.value}%`
                    : `$${coupon.value.toFixed(2)}`}
                </td>
                <td className="text-muted-foreground p-4">
                  {coupon.minOrder ? `$${coupon.minOrder.toFixed(2)}` : '—'}
                </td>
                <td className="p-4">
                  {coupon.uses}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                </td>
                <td className="text-muted-foreground p-4">
                  {coupon.expiresAt
                    ? new Date(coupon.expiresAt).toLocaleDateString()
                    : '—'}
                </td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await toggleCoupon(coupon.id, !coupon.active)
                      })
                    }
                    disabled={isPending}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      coupon.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {coupon.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        if (confirm('Delete this coupon?')) {
                          await deleteCoupon(coupon.id)
                        }
                      })
                    }
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
