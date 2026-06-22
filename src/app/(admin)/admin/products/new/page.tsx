import { getCategories } from '@/actions/products'
import ProductForm from '@/components/admin/product-form'

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-muted-foreground mt-1">Create a new product</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
