export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import {
  Package,
  ShoppingCart,
  Users,
  CurrencyDollar,
} from '@phosphor-icons/react/dist/ssr'
import RevenueChart from '@/components/admin/revenue-chart'
import OrderStatusChart from '@/components/admin/order-status-chart'
import TopProductsTable from '@/components/admin/top-products-table'

const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
export default async function AdminDashboard() {
  const [
    products,
    orders,
    users,
    revenue,
    recentOrders,
    ordersByStatus,
    topProducts,
    dailyRevenue,
  ] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count(),
    db.order.aggregate({ _sum: { total: true } }),

    // Recent orders
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),

    // Orders by status
    db.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),

    // Top products by order count
    db.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: { productId: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),

    // Daily revenue for last 30 days
    db.order.findMany({
      where: {
        createdAt: {
          gte: THIRTY_DAYS_AGO,
        },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Fetch product details for top products
  const topProductIds = topProducts.map((p) => p.productId)
  const topProductDetails = await db.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, price: true, images: true },
  })

  const topProductsWithDetails = topProducts.map((item) => ({
    ...item,
    product: topProductDetails.find((p) => p.id === item.productId),
  }))

  // Process daily revenue into chart data
  const revenueByDay = dailyRevenue.reduce(
    (acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      acc[date] = (acc[date] ?? 0) + Number(order.total)
      return acc
    },
    {} as Record<string, number>
  )

  const revenueChartData = Object.entries(revenueByDay).map(
    ([date, total]) => ({
      date,
      total: Math.round(total * 100) / 100,
    })
  )

  const statusChartData = ordersByStatus.map((s) => ({
    status: s.status,
    count: s._count.status,
  }))

  const stats = [
    {
      label: 'Total Products',
      value: products,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Orders',
      value: orders,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Total Users',
      value: users,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Revenue',
      value: `$${Number(revenue._sum.total ?? 0).toFixed(2)}`,
      icon: CurrencyDollar,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to Marketi Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card space-y-3 rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <div className={`${bg} rounded-lg p-2`}>
                <Icon size={20} className={color} />
              </div>
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-card rounded-lg border p-6 lg:col-span-2">
          <h2 className="mb-4 font-bold">Revenue — Last 30 Days</h2>
          <RevenueChart data={revenueChartData} />
        </div>
        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-4 font-bold">Orders by Status</h2>
          <OrderStatusChart data={statusChartData} />
        </div>
      </div>

      {/* Top products + Recent orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-4 font-bold">Top Selling Products</h2>
          <TopProductsTable products={topProductsWithDetails} />
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="mb-4 font-bold">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {order.user.name ?? order.user.email}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      ${Number(order.total).toFixed(2)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
