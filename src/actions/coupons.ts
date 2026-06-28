'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const CouponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.coerce.number().positive('Value must be positive'),
  minOrder: z.coerce.number().positive().optional().or(z.literal('')),
  maxUses: z.coerce.number().int().positive().optional().or(z.literal('')),
  active: z.boolean().default(true),
  expiresAt: z.string().optional(),
})

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/')
}

export async function createCoupon(values: unknown) {
  await requireAdmin()

  const validated = CouponSchema.safeParse(values)
  if (!validated.success) return { error: 'Invalid fields' }

  const { minOrder, maxUses, expiresAt, ...data } = validated.data

  try {
    await db.coupon.create({
      data: {
        ...data,
        minOrder: minOrder ? minOrder : null,
        maxUses: maxUses ? maxUses : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })
    revalidatePath('/admin/coupons')
    return { success: 'Coupon created!' }
  } catch (e) {
    console.error('Coupon creation error:', e)
    return { error: 'Code already exists or failed to create' }
  }
}

export async function deleteCoupon(id: string) {
  await requireAdmin()
  await db.coupon.delete({ where: { id } })
  revalidatePath('/admin/coupons')
}

export async function toggleCoupon(id: string, active: boolean) {
  await requireAdmin()
  await db.coupon.update({ where: { id }, data: { active } })
  revalidatePath('/admin/coupons')
}

export async function validateCoupon(code: string, orderTotal: number) {
  const session = await auth()
  if (!session) return { error: 'You must be logged in' }

  const coupon = await db.coupon.findUnique({
    where: { code: code.toUpperCase() },
  })

  if (!coupon) return { error: 'Invalid coupon code' }
  if (!coupon.active) return { error: 'This coupon is no longer active' }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { error: 'This coupon has expired' }
  }
  if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
    return { error: 'This coupon has reached its usage limit' }
  }
  if (coupon.minOrder && orderTotal < Number(coupon.minOrder)) {
    return {
      error: `Minimum order of $${Number(coupon.minOrder).toFixed(2)} required`,
    }
  }

  const discount =
    coupon.type === 'PERCENTAGE'
      ? (orderTotal * Number(coupon.value)) / 100
      : Math.min(Number(coupon.value), orderTotal)

  return {
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
    },
    discount: Math.round(discount * 100) / 100,
  }
}
