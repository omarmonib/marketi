import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import ProductCard from '@/components/store/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HomePage() {
  const session = await auth()

  const [featuredProducts, categories, wishlistItems] = await Promise.all([
    db.product.findMany({
      where: { published: true, featured: true },
      include: { category: true },
      take: 4,
    }),
    db.category.findMany({
      take: 5,
    }),
    session
      ? db.wishlist.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ])

  const savedProductIds = new Set(wishlistItems.map((w) => w.productId))

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow effects */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-purple-500/20 blur-[100px]" />

        {/* Content */}
        <div className="relative container mx-auto space-y-6 px-4 py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur-sm">
            ✦ Free shipping on orders over $50
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Shop Everything
            <span className="mt-2 block bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              at Marketi
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/60">
            Discover thousands of products across every category — electronics,
            fashion, home, books, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-slate-900 hover:bg-white/90"
            >
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                icon: '🚚',
                title: 'Free Shipping',
                desc: 'On orders over $50',
              },
              {
                icon: '🔒',
                title: 'Secure Payments',
                desc: '100% protected by Stripe',
              },
              {
                icon: '↩️',
                title: 'Easy Returns',
                desc: '30-day return policy',
              },
              {
                icon: '💬',
                title: '24/7 Support',
                desc: "We're always here to help",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
          {categories.map((category, i) => {
            const gradients = [
              'from-blue-500/10 to-blue-600/20 hover:from-blue-500/20 hover:to-blue-600/30 border-blue-500/20',
              'from-purple-500/10 to-purple-600/20 hover:from-purple-500/20 hover:to-purple-600/30 border-purple-500/20',
              'from-emerald-500/10 to-emerald-600/20 hover:from-emerald-500/20 hover:to-emerald-600/30 border-emerald-500/20',
              'from-orange-500/10 to-orange-600/20 hover:from-orange-500/20 hover:to-orange-600/30 border-orange-500/20',
              'from-rose-500/10 to-rose-600/20 hover:from-rose-500/20 hover:to-rose-600/30 border-rose-500/20',
            ]
            const icons = ['👕', '📚', '⚽', '💻', '🏡']
            const gradient = gradients[i % gradients.length]
            const icon = icons[i % icons.length]

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={`group flex flex-col items-center gap-3 rounded-xl border bg-linear-to-br p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${gradient} ${
                  i === categories.length - 1 && categories.length % 2 !== 0
                    ? 'col-span-2 sm:col-span-1'
                    : ''
                }`}
              >
                <span className="text-3xl">{icon}</span>
                <p className="text-sm font-semibold">{category.name}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                comparePrice: product.comparePrice
                  ? Number(product.comparePrice)
                  : null,
              }}
              isLoggedIn={!!session}
              isSaved={savedProductIds.has(product.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
