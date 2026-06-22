import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react/dist/ssr'
import AdminProductsTable from '@/components/admin/products-table'

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            {products.length} products total
          </p>
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
    </div>
  )
}
