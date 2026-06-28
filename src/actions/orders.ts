'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@prisma/client'

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin()

  await db.order.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/admin/orders')
}
