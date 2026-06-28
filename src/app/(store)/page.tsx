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
      <section className="bg-muted/40 border-b">
        <div className="container mx-auto space-y-6 px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Shop Everything
            <span className="text-muted-foreground mt-2 block text-3xl font-normal md:text-4xl">
              at Marketi
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-lg">
            Discover thousands of products across every category — electronics,
            fashion, home, books, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="hover:bg-muted/50 hover:border-primary rounded-lg border p-4 text-center transition-all"
            >
              <p className="text-sm font-medium">{category.name}</p>
            </Link>
          ))}
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
