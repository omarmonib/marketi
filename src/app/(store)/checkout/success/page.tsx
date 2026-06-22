'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from '@phosphor-icons/react'
import { useCartStore } from '@/store/cart'

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto space-y-6 px-4 py-16 text-center">
      <div className="flex justify-center">
        <CheckCircle size={64} className="text-green-500" weight="fill" />
      </div>
      <h1 className="text-3xl font-bold">Order Confirmed!</h1>
      <p className="text-muted-foreground mx-auto max-w-md">
        Thank you for your purchase. We&apos;ll send you a confirmation email
        shortly with your order details.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  )
}
