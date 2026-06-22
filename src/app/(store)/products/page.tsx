import { db } from '@/lib/db'
import ProductCard from '@/components/store/product-card'

export const metadata = {
  title: 'Products — Marketi',
  description: 'Browse our wide variety of products',
}

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-muted-foreground mt-1">
          {products.length} products available
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          />
        ))}
      </div>
    </div>
  )
}
