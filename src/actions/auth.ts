'use server'

import { signIn } from '@/lib/auth'
import { db } from '@/lib/db'
import { LoginSchema, RegisterSchema } from '@/validators/auth'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'

export async function login(values: unknown) {
  const validated = LoginSchema.safeParse(values)
  if (!validated.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password } = validated.data

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
