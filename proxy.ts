import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAuthRoute =
    nextUrl.pathname.startsWith('/login') ||
    nextUrl.pathname.startsWith('/register')
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')

  if (isApiAuthRoute) return

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/', nextUrl))
    }
    return
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', nextUrl))
    }
    if (req.auth?.user?.role !== 'ADMIN') {
      return Response.redirect(new URL('/', nextUrl))
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
