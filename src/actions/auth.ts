'use server'

import { signIn } from '@/lib/auth'
import { db } from '@/lib/db'
import { LoginSchema, RegisterSchema } from '@/validators/auth' // ← fix 1
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { authRatelimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'

export async function login(values: unknown) {
  const ip = (await headers()).get('x-forwarded-for') ?? 'anonymous'
  const { success } = await authRatelimit.limit(ip)
  if (!success) {
    return { error: 'Too many attempts. Please try again in 10 minutes.' }
  }

  const validated = LoginSchema.safeParse(values)
  if (!validated.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password } = validated.data // ← fix 2

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    return { success: 'Logged in successfully' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' }
        default:
          return { error: 'Something went wrong' }
      }
    }
    throw error
  }
}

export async function register(values: unknown) {
  const ip = (await headers()).get('x-forwarded-for') ?? 'anonymous' // ← fix 3
  const { success } = await authRatelimit.limit(ip)
  if (!success) {
    return { error: 'Too many attempts. Please try again in 10 minutes.' }
  }

  const validated = RegisterSchema.safeParse(values)
  if (!validated.success) {
    return { error: 'Invalid fields' }
  }

  const { name, email, password } = validated.data

  try {
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return { error: 'Email already in use' }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await db.user.create({
      data: { name, email, password: hashedPassword },
    })

    return { success: 'Account created! Please log in.' }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }
}
