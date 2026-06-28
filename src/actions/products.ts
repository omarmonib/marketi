'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ProductSchema } from '@/validators/product'

export async function createProduct(values: unknown) {
  await requireAdmin()

  const validated = ProductSchema.safeParse(values)
  if (!validated.success) {
    return { error: 'Invalid fields' }
  }

  const { comparePrice, ...data } = validated.data

  try {
    const slug = data.slug
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    await db.product.create({
      data: {
        ...data,
        slug,
        comparePrice,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: 'Product created successfully' }
  } catch {
    return { error: 'Failed to create product' }
  }
}

export async function updateProduct(id: string, values: unknown) {
  await requireAdmin()

  const validated = ProductSchema.safeParse(values)
  if (!validated.success) {
    return { error: 'Invalid fields' }
  }

  const { comparePrice, ...data } = validated.data

  try {
    await db.product.update({
      where: { id },
      data: {
        ...data,
        comparePrice,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: 'Product updated successfully' }
  } catch {
    return { error: 'Failed to update product' }
  }
}

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: 'asc' } })
}

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  await db.product.delete({ where: { id } })
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
  revalidatePath('/categories', 'layout')
}
