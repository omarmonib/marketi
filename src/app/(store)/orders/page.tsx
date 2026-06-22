import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OrderStatus } from '@prisma/client'

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  REFUNDED: 'bg-gray-100 text-gray-800 border-gray-300',
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="space-y-4 py-16 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t placed any orders yet.
          </p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card space-y-4 rounded-lg border p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded border px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-lg font-bold">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="divide-y rounded-md border">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground text-xs">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
