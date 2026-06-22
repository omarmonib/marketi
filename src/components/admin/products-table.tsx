'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash } from '@phosphor-icons/react'
import Link from 'next/link'
import Image from 'next/image'
import { deleteProduct } from '@/actions/products'

type Product = {
  id: string
  name: string
  price: number
  comparePrice: number | null
  stock: number
  published: boolean
  featured: boolean
  images: string[]
  category: { name: string }
}

export default function AdminProductsTable({
  products,
}: {
  products: Product[]
}) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return
    setDeletingId(id)
    startTransition(async () => {
      await deleteProduct(id)
      setDeletingId(null)
    })
  }

  return (
    <div className="bg-card overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="p-4 text-left font-medium">Product</th>
            <th className="p-4 text-left font-medium">Category</th>
            <th className="p-4 text-left font-medium">Price</th>
            <th className="p-4 text-left font-medium">Stock</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <span className="line-clamp-1 font-medium">
                    {product.name}
                  </span>
                </div>
              </td>
              <td className="text-muted-foreground p-4">
                {product.category.name}
              </td>
              <td className="p-4">
                <div>
                  <span className="font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-muted-foreground ml-2 text-xs line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-4">
                <span
                  className={
                    product.stock <= 5 ? 'font-medium text-orange-500' : ''
                  }
                >
                  {product.stock}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  {product.published ? (
                    <Badge
                      variant="outline"
                      className="border-green-600 text-green-600"
                    >
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                  {product.featured && <Badge>Featured</Badge>}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Pencil size={16} />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(product.id)}
                    disabled={isPending && deletingId === product.id}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
