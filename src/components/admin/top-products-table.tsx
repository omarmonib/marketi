import Image from 'next/image'

type Props = {
  products: {
    productId: string
    _sum: { quantity: number | null }
    _count: { productId: number }
    product?: {
      id: string
      name: string
      price: unknown
      images: string[]
    }
  }[]
}

export default function TopProductsTable({ products }: Props) {
  if (products.length === 0) {
    return <p className="text-muted-foreground text-sm">No sales data yet</p>
  }

  return (
    <div className="space-y-3">
      {products.map((item, i) => (
        <div key={item.productId} className="flex items-center gap-3">
          <span className="text-muted-foreground w-5 font-mono text-sm">
            {i + 1}
          </span>
          <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
            {item.product?.images[0] && (
              <Image
                src={item.product.images[0]}
                alt={item.product.name ?? ''}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {item.product?.name ?? 'Unknown Product'}
            </p>
            <p className="text-muted-foreground text-xs">
              {item._sum.quantity ?? 0} units sold
            </p>
          </div>
          <p className="text-sm font-bold">
            ${Number(item.product?.price ?? 0).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}
