import { db } from '@/lib/db'
import ProductCard from '@/components/store/product-card'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const products = query
    ? await db.product.findMany({
        where: {
          published: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Search Products</h1>
        <form method="GET" action="/search">
          <div className="flex max-w-xl gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for products..."
              className="bg-background focus:ring-primary flex-1 rounded-md border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <MagnifyingGlass size={16} />
              Search
            </button>
          </div>
        </form>
      </div>

      {query && (
        <p className="text-muted-foreground mb-6">
          {products.length} result{products.length !== 1 ? 's' : ''} for &quot;
          {query}&quot;
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                comparePrice: product.comparePrice
                  ? Number(product.comparePrice)
                  : null,
              }}
            />
          ))}
        </div>
      ) : query ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            No products found for &quot;{query}&quot;
          </p>
        </div>
      ) : null}
    </div>
  )
}
