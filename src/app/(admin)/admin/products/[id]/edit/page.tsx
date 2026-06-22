import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { getCategories } from '@/actions/products'
import ProductForm from '@/components/admin/product-form'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    getCategories(),
  ])

  if (!product) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-1">{product.name}</p>
      </div>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          comparePrice: product.comparePrice
            ? Number(product.comparePrice)
            : '',
          stock: product.stock,
          categoryId: product.categoryId,
          images: product.images,
          featured: product.featured,
          published: product.published,
        }}
      />
    </div>
  )
}
