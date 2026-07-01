import { db } from '@/lib/db'
import ProductCard from '@/components/store/product-card'
import { auth } from '@/lib/auth'

type Props = {
  categoryId: string
  excludeId: string
}

export default async function RelatedProducts({
  categoryId,
  excludeId,
}: Props) {
  const session = await auth()

  const [products, wishlistItems] = await Promise.all([
    db.product.findMany({
      where: {
        published: true,
        categoryId,
        id: { not: excludeId },
      },
      include: { category: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    session
      ? db.wishlist.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ])

  if (products.length === 0) return null

  const savedProductIds = new Set(wishlistItems.map((w) => w.productId))

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              price: Number(product.price),
              comparePrice: product.comparePrice
                ? Number(product.comparePrice)
                : null,
            }}
            isLoggedIn={!!session}
            isSaved={savedProductIds.has(product.id)}
          />
        ))}
      </div>
    </section>
  )
}
