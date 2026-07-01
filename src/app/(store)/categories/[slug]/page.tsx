import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/store/product-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await db.category.findUnique({ where: { slug } })
  if (!category) return {}

  return {
    title: `${category.name} Products`,
    description:
      category.description ??
      `Browse all ${category.name} products at Marketi.`,
    openGraph: {
      title: `${category.name} — Marketi`,
      description:
        category.description ?? `Browse all ${category.name} products.`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const category = await db.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { published: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!category) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-muted-foreground mb-2 text-sm">
          <Link href="/categories" className="hover:text-primary">
            Categories
          </Link>{' '}
          → {category.name}
        </p>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-1">{category.description}</p>
        )}
        <p className="mt-2 text-sm">{category.products.length} products</p>
      </div>

      {category.products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground mb-4">
            No products in this category yet.
          </p>
          <Button asChild variant="outline">
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {category.products.map((product) => (
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
      )}
    </div>
  )
}
