import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react/dist/ssr'
import AdminProductsTable from '@/components/admin/products-table'
import Pagination from '@/components/shared/pagination'
import { Suspense } from 'react'

const PER_PAGE = 20

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = Math.max(1, Number(page ?? 1))

  const [products, total] = await Promise.all([
    db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.product.count(),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">{total} products total</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus size={16} className="mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <AdminProductsTable
        products={products.map((p) => ({
          ...p,
          price: Number(p.price),
          comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        }))}
      />

      {totalPages > 1 && (
        <Suspense>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </Suspense>
      )}
    </div>
  )
}
