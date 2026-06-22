import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">{users.length} users total</p>
      </div>

      <div className="bg-card overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 text-left font-medium">Name</th>
              <th className="p-4 text-left font-medium">Email</th>
              <th className="p-4 text-left font-medium">Role</th>
              <th className="p-4 text-left font-medium">Orders</th>
              <th className="p-4 text-left font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">{user.name ?? '—'}</td>
                <td className="text-muted-foreground p-4">{user.email}</td>
                <td className="p-4">
                  {user.role === 'ADMIN' ? (
                    <Badge>Admin</Badge>
                  ) : (
                    <Badge variant="outline">User</Badge>
                  )}
                </td>
                <td className="p-4">{user._count.orders}</td>
                <td className="text-muted-foreground p-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
