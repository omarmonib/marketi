import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from '@phosphor-icons/react/dist/ssr'
import AdminCouponsTable from '@/components/admin/coupons-table'

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground mt-1">
            {coupons.length} coupons total
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <Plus size={16} className="mr-2" />
            Add Coupon
          </Link>
        </Button>
      </div>

      <AdminCouponsTable
        coupons={coupons.map((c) => ({
          ...c,
          value: Number(c.value),
          minOrder: c.minOrder ? Number(c.minOrder) : null,
        }))}
      />
    </div>
  )
}
