import { db } from '@/lib/db'
import {
  Package,
  ShoppingCart,
  Users,
  CurrencyDollar,
} from '@phosphor-icons/react/dist/ssr'

export default async function AdminDashboard() {
  const [products, orders, users] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count(),
  ])

  const stats = [
    { label: 'Total Products', value: products, icon: Package },
    { label: 'Total Orders', value: orders, icon: ShoppingCart },
    { label: 'Total Users', value: users, icon: Users },
    { label: 'Revenue', value: '$0.00', icon: CurrencyDollar },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to Marketi Admin</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card space-y-2 rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <Icon size={20} className="text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
