'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCartSimple, Check } from '@phosphor-icons/react'
import { useCartStore } from '@/store/cart'

type Props = {
  product: {
    id: string
    name: string
    price: number
    image: string
    stock: number
  }
}

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  function handleAddToCart() {
    addItem({ ...product, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      size="lg"
      className="w-full px-12 md:w-auto"
      onClick={handleAddToCart}
      disabled={product.stock === 0 || added}
    >
      {added ? (
        <>
          <Check size={20} className="mr-2" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCartSimple size={20} className="mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
