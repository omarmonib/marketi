// Simple in-memory rate limiter — no external dependencies
// Suitable for portfolio/demo projects
// For production scale, swap the Map for Redis behind this same interface

const attempts = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_ATTEMPTS = 5

export const authRatelimit = {
  async limit(ip: string): Promise<{ success: boolean }> {
    const now = Date.now()
    const record = attempts.get(ip)

    if (!record || now > record.resetAt) {
      attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
      return { success: true }
    }

    if (record.count >= MAX_ATTEMPTS) {
      return { success: false }
    }

    record.count++
    return { success: true }
  },
}
