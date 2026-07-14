import Navbar from '@/components/shared/navbar'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { ShoppingBag } from '@phosphor-icons/react/dist/ssr'
import { getTranslations } from 'next-intl/server'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('footer')

  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer className="bg-muted/30 mt-16 border-t">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {/* Brand */}
              <div className="col-span-2 space-y-4 md:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                    <ShoppingBag
                      size={18}
                      className="text-white"
                      weight="fill"
                    />
                  </div>
                  <span className="text-lg font-bold">Marketi</span>
                </Link>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('tagline')}
                </p>
                <div className="flex gap-3">
                  {['𝕏', 'f', 'in', '▶'].map((icon) => (
                    <div
                      key={icon}
                      className="bg-background hover:border-primary hover:text-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-xs font-bold transition-colors"
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shop */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  {t('shop')}
                </h3>
                <ul className="space-y-2">
                  {[
                    { href: '/products', label: t('allProducts') },
                    { href: '/categories', label: t('categories') },
                    {
                      href: '/products?sort=price_asc',
                      label: t('bestPrices'),
                    },
                    { href: '/products?featured=true', label: t('featured') },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  {t('account')}
                </h3>
                <ul className="space-y-2">
                  {[
                    { href: '/login', label: t('signIn') },
                    { href: '/register', label: t('createAccount') },
                    { href: '/orders', label: t('myOrders') },
                    { href: '/wishlist', label: t('wishlist') },
                    { href: '/profile', label: t('profile') },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  {t('support')}
                </h3>
                <ul className="space-y-2">
                  {[
                    { label: t('helpCenter') },
                    { label: t('shippingPolicy') },
                    { label: t('returns') },
                    { label: t('privacy') },
                    { label: t('terms') },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
              <p className="text-muted-foreground text-xs">
                {t('rights', { year: new Date().getFullYear() })}
              </p>
              <div className="flex items-center gap-4">
                {['Visa', 'Mastercard', 'PayPal', 'Stripe'].map((method) => (
                  <span
                    key={method}
                    className="bg-background text-muted-foreground rounded border px-2 py-1 text-xs font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>
  )
}
