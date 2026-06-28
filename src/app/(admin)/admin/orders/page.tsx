import { db } from '@/lib/db'
import Pagination from '@/components/shared/pagination'
import { Suspense } from 'react'
import OrderStatusSelect from '@/components/admin/order-status-select'

const PER_PAGE = 20

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = Math.max(1, Number(page ?? 1))

  const [orders, total] = await Promise.all([
    db.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.order.count(),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">{total} orders total</p>
      </div>

      <div className="bg-card overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 text-left font-medium">Order ID</th>
              <th className="p-4 text-left font-medium">Customer</th>
              <th className="p-4 text-left font-medium">Items</th>
              <th className="p-4 text-left font-medium">Total</th>
              <th className="p-4 text-left font-medium">Status</th>
              <th className="p-4 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-muted-foreground p-8 text-center"
                >
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-mono text-xs">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {order.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">{order.items.length} items</td>
                  <td className="p-4 font-medium">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                  <td className="text-muted-foreground p-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Suspense>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </Suspense>
      )}
    </div>
  )
}
