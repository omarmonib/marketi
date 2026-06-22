import { db } from '@/lib/db'
import Link from 'next/link'

export const metadata = {
  title: 'Categories — Marketi',
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Categories</h1>
        <p className="text-muted-foreground mt-1">
          Browse products by category
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group bg-card hover:border-primary space-y-3 rounded-lg border p-8 text-center transition-all hover:shadow-md"
          >
            <h2 className="group-hover:text-primary text-xl font-bold transition-colors">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-muted-foreground text-sm">
                {category.description}
              </p>
            )}
            <p className="text-primary text-sm font-medium">
              {category._count.products} products →
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
