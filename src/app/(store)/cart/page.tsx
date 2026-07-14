'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trash, Plus, Minus } from '@phosphor-icons/react'
import CheckoutButton from '@/components/store/checkout-button'
import CouponInput from '@/components/store/coupon-input'
import { useTranslations } from 'next-intl'

type CouponResult = {
  coupon: { id: string; code: string; type: string; value: number }
  discount: number
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore()
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null)
  const t = useTranslations('cart')

  const subtotal = totalPrice()
  const discount = appliedCoupon?.discount ?? 0
  const total = Math.max(0, subtotal - discount)

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">{t('empty')}</h1>
        <p className="text-muted-foreground mb-8">{t('emptyDesc')}</p>
        <Button asChild>
          <Link href="/products">{t('browseProducts')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card flex gap-4 rounded-lg border p-4"
            >
              <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Link
                    href={`/products/${item.slug}`}
                    className="hover:text-primary font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                <p className="text-sm font-bold">${item.price.toFixed(2)}</p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded border transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded border transition-colors disabled:opacity-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
          >
            {t('clearCart')}
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card sticky top-24 space-y-4 rounded-lg border p-6">
            <h2 className="text-xl font-bold">{t('orderSummary')}</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t('discount')}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span className="text-green-600">{t('free')}</span>
              </div>
            </div>

            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <span>{t('total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <CouponInput
              orderTotal={subtotal}
              applied={appliedCoupon}
              onApply={setAppliedCoupon}
              onRemove={() => setAppliedCoupon(null)}
            />

            <CheckoutButton
              couponCode={appliedCoupon?.coupon.code}
              discountedTotal={total}
            />

            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">{t('continueShopping')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
