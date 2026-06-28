import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import ProductCard from '@/components/store/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Wishlist — Marketi',
}

export default async function WishlistPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const wishlistItems = await db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground mt-1">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}{' '}
          saved
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="space-y-4 py-16 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t saved any products yet.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map(({ product }) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                comparePrice: product.comparePrice
                  ? Number(product.comparePrice)
                  : null,
              }}
              isLoggedIn={true}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
