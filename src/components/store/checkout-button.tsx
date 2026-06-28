'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Props = {
  couponCode?: string
  discountedTotal?: number
}

export default function CheckoutButton({ couponCode, discountedTotal }: Props) {
  const [loading, setLoading] = useState(false)
  const { items } = useCartStore()
  const { data: session } = useSession()
  const router = useRouter()

  async function handleCheckout() {
    if (!session) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, couponCode, discountedTotal }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
    >
      {loading ? 'Redirecting...' : 'Proceed to Checkout'}
    </Button>
  )
}
