import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import AddToCartButton from '@/components/store/add-to-cart-button'
import WishlistButton from '@/components/store/wishlist-button'
import ReviewForm from '@/components/store/review-form'
import ReviewsList from '@/components/store/reviews-list'
import StarRating from '@/components/shared/star-rating'
import { Suspense } from 'react'
import RelatedProducts from '@/components/store/related-products'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug, published: true },
    include: { category: true },
  })

  if (!product) return {}

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [product, session] = await Promise.all([
    db.product.findUnique({
      where: { slug, published: true },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    auth(),
  ])

  if (!product) notFound()

  const wishlistEntry = session
    ? await db.wishlist.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: product.id,
          },
        },
      })
    : null

  const price = Number(product.price)
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null
  const discount = comparePrice
    ? Math.round((1 - price / comparePrice) * 100)
    : null

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Image */}
        <div className="bg-muted relative aspect-square overflow-hidden rounded-lg">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          )}
          {discount && (
            <Badge className="bg-destructive absolute top-4 left-4 px-3 py-1 text-lg">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">
              {product.category.name}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          {/* Rating summary */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgRating)} readonly size={16} />
              <span className="text-muted-foreground text-sm">
                {avgRating.toFixed(1)} ({product.reviews.length}{' '}
                {product.reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${price.toFixed(2)}</span>
            {comparePrice && (
              <span className="text-muted-foreground text-xl line-through">
                ${comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
            {product.stock <= product.lowStock && product.stock > 0 && (
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-500"
              >
                Low Stock
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price,
                image: product.images[0] ?? '',
                stock: product.stock,
              }}
            />
            <WishlistButton
              productId={product.id}
              initialSaved={!!wishlistEntry}
              isLoggedIn={!!session}
            />
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold">
          Reviews ({product.reviews.length})
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ReviewsList
            reviews={product.reviews}
            productSlug={slug}
            currentUserId={session?.user.id}
            isAdmin={session?.user.role === 'ADMIN'}
          />

          {session ? (
            <ReviewForm productId={product.id} />
          ) : (
            <div className="bg-muted/40 rounded-lg border p-6 text-center">
              <p className="text-muted-foreground text-sm">
                Please{' '}
                <a href="/login" className="text-primary underline">
                  sign in
                </a>{' '}
                to leave a review.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Related products */}
      <Suspense
        fallback={
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-muted aspect-square animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>
        }
      >
        <RelatedProducts
          categoryId={product.categoryId}
          excludeId={product.id}
        />
      </Suspense>
    </div>
  )
}
