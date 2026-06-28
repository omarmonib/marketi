'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export async function updateProfile(values: unknown) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const validated = UpdateProfileSchema.safeParse(values)
  if (!validated.success) return { error: 'Invalid fields' }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: validated.data.name },
  })

  revalidatePath('/profile')
  return { success: 'Profile updated!' }
}

export async function changePassword(values: unknown) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const validated = ChangePasswordSchema.safeParse(values)
 if (!validated.success) {
   const firstError = Object.values(
     validated.error.flatten().fieldErrors
   )[0]?.[0]
   return { error: firstError ?? 'Invalid fields' }
 }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user?.password) {
    return {
      error: 'Password change is not available for social login accounts',
    }
  }

  const passwordMatch = await bcrypt.compare(
    validated.data.currentPassword,
    user.password
  )
  if (!passwordMatch) return { error: 'Current password is incorrect' }

  const hashedPassword = await bcrypt.hash(validated.data.newPassword, 12)

  await db.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return { success: 'Password changed successfully!' }
}
