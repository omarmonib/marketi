'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCartSimple } from '@phosphor-icons/react'
import { useCartStore } from '@/store/cart'
import WishlistButton from '@/components/store/wishlist-button'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string[]
  stock: number
  featured: boolean
  category: { name: string }
}

type Props = {
  product: Product
  isLoggedIn?: boolean
  isSaved?: boolean
}

export default function ProductCard({
  product,
  isLoggedIn = false,
  isSaved = false,
}: Props) {
  const addItem = useCartStore((state) => state.addItem)

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? '',
      quantity: 1,
      stock: product.stock,
    })
  }

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null

  return (
    <div className="group bg-card overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`}>
        <div className="bg-muted relative aspect-square overflow-hidden">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {discount && (
            <Badge className="bg-destructive absolute top-2 left-2">
              -{discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2">Featured</Badge>
          )}
        </div>
      </Link>

      <div className="space-y-2 p-4">
        <p className="text-muted-foreground text-xs">{product.category.name}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="hover:text-primary line-clamp-2 leading-tight font-medium transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          {product.comparePrice && (
            <span className="text-muted-foreground text-sm line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="flex-1"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCartSimple size={16} className="mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <WishlistButton
            productId={product.id}
            initialSaved={isSaved}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    </div>
  )
}
