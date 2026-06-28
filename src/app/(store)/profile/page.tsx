import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OrderStatus } from '@prisma/client'
import UpdateProfileForm from '@/components/store/update-profile-form'
import ChangePasswordForm from '@/components/store/change-password-form'

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-300',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  REFUNDED: 'bg-gray-100 text-gray-800 border-gray-300',
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true },
      },
    },
  })

  if (!user) redirect('/login')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column — forms */}
        <div className="space-y-6 lg:col-span-2">
          <UpdateProfileForm
            defaultName={user.name ?? ''}
            email={user.email ?? ''}
          />
          <ChangePasswordForm hasPassword={!!user.password} />
        </div>

        {/* Right column — recent orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/orders">View all</Link>
            </Button>
          </div>

          {user.orders.length === 0 ? (
            <div className="bg-card space-y-3 rounded-lg border p-6 text-center">
              <p className="text-muted-foreground text-sm">No orders yet</p>
              <Button asChild size="sm">
                <Link href="/products">Start shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card space-y-2 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs font-medium">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <span
                      className={`rounded border px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs">
                      {order.items.length}{' '}
                      {order.items.length === 1 ? 'item' : 'items'} ·{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-bold">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Account stats */}
          <div className="bg-card mt-6 space-y-3 rounded-lg border p-4">
            <h3 className="text-sm font-bold">Account Stats</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total orders</span>
                <span className="font-medium">{user.orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
