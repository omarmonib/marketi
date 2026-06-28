import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import ProductCard from '@/components/store/product-card'
import Pagination from '@/components/shared/pagination'
import ProductFilters from '@/components/store/product-filters'
import ActiveFilters from '@/components/store/active-filters'
import { Suspense } from 'react'

const PER_PAGE = 12

export const metadata = {
  title: 'Products — Marketi',
  description: 'Browse our wide variety of products',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    sort?: string
    category?: string
    price?: string
  }>
}) {
  const { page, sort, category, price } = await searchParams
  const currentPage = Math.max(1, Number(page ?? 1))

  // Build where clause
  const where: Prisma.ProductWhereInput = { published: true }

  if (category) {
    where.category = { slug: category }
  }

  if (price) {
    const [min, max] = price.split('-').map(Number)
    where.price = { gte: min, lte: max }
  }

  // Build order by
  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' }
      case 'price_desc':
        return { price: 'desc' }
      case 'name_asc':
        return { name: 'asc' }
      default:
        return { createdAt: 'desc' }
    }
  })()

  const session = await auth()

  const [products, total, categories, wishlistItems] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.product.count({ where }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
    session
      ? db.wishlist.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ])

  const savedProductIds = new Set(wishlistItems.map((w) => w.productId))
  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-muted-foreground mt-1">{total} products available</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar filters */}
        <aside className="lg:col-span-1">
          <Suspense>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        {/* Products grid */}
        <div className="space-y-6 lg:col-span-3">
          <Suspense>
            <ActiveFilters />
          </Suspense>

          {products.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                No products match your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
          )}

          {totalPages > 1 && (
            <Suspense>
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  )
}
