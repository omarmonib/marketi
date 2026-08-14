'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
  data: { status: string; count: number }[]
}

const COLORS: Record<string, string> = {
  PENDING: '#eab308',
  PROCESSING: '#3b82f6',
  SHIPPED: '#a855f7',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
  REFUNDED: '#6b7280',
}

export default function OrderStatusChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-muted-foreground text-sm">No orders yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={false}
          labelLine={false}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={COLORS[entry.status] ?? '#6b7280'} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [Number(value), 'Orders']}
          contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
