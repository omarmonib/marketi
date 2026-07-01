import { db } from '@/lib/db'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    db.category.findMany({
      select: { slug: true },
    }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
