import { db } from '@/lib/db'
import { OrderStatus } from '@prisma/client'

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  REFUNDED: 'bg-gray-100 text-gray-800 border-gray-300',
}

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          {orders.length} orders total
        </p>
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
                    <span
                      className={`rounded border px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
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
    </div>
  )
}
