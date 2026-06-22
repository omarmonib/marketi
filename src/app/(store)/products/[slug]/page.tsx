import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import AddToCartButton from '@/components/store/add-to-cart-button'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await db.product.findUnique({
    where: { slug, published: true },
    include: { category: true },
  })

  if (!product) notFound()

  const price = Number(product.price)
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null
  const discount = comparePrice
    ? Math.round((1 - price / comparePrice) * 100)
    : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Image */}
        <div className="bg-muted relative aspect-square overflow-hidden rounded-lg">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          )}
          {discount && (
            <Badge className="bg-destructive absolute top-4 left-4 px-3 py-1 text-lg">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">
              {product.category.name}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${price.toFixed(2)}</span>
            {comparePrice && (
              <span className="text-muted-foreground text-xl line-through">
                ${comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
            {product.stock <= product.lowStock && product.stock > 0 && (
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-500"
              >
                Low Stock
              </Badge>
            )}
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price,
              image: product.images[0] ?? '',
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </div>
  )
}
