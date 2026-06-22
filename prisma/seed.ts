import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Categories
  const categories = await Promise.all([
    db.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Gadgets and devices',
      },
    }),
    db.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
      },
    }),
    db.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home essentials',
      },
    }),
    db.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: {
        name: 'Books',
        slug: 'books',
        description: 'Books and literature',
      },
    }),
    db.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports and outdoors',
      },
    }),
  ])

  console.log(`Created ${categories.length} categories`)

  // Products
  const products = [
    {
      name: 'Wireless Noise-Cancelling Headphones',
      slug: 'wireless-noise-cancelling-headphones',
      description:
        'Premium audio experience with active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
      price: 299.99,
      comparePrice: 399.99,
      stock: 50,
      categoryId: categories[0].id,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      ],
      featured: true,
    },
    {
      name: 'Smartphone Pro Max',
      slug: 'smartphone-pro-max',
      description:
        'Latest flagship smartphone with 6.7" OLED display, 200MP camera, and 5000mAh battery.',
      price: 1099.99,
      comparePrice: 1299.99,
      stock: 30,
      categoryId: categories[0].id,
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      ],
      featured: true,
    },
    {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-t-shirt',
      description:
        'Soft, breathable 100% organic cotton t-shirt. Available in multiple colors.',
      price: 29.99,
      stock: 200,
      categoryId: categories[1].id,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      ],
      featured: false,
    },
    {
      name: 'Slim Fit Denim Jeans',
      slug: 'slim-fit-denim-jeans',
      description:
        'Modern slim fit jeans made from premium stretch denim for all-day comfort.',
      price: 79.99,
      comparePrice: 99.99,
      stock: 120,
      categoryId: categories[1].id,
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      ],
      featured: false,
    },
    {
      name: 'Ceramic Coffee Mug Set',
      slug: 'ceramic-coffee-mug-set',
      description:
        'Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe.',
      price: 44.99,
      stock: 80,
      categoryId: categories[2].id,
      images: [
        'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
      ],
      featured: false,
    },
    {
      name: 'Smart LED Desk Lamp',
      slug: 'smart-led-desk-lamp',
      description:
        'Adjustable brightness and color temperature. USB charging port built-in.',
      price: 59.99,
      comparePrice: 79.99,
      stock: 60,
      categoryId: categories[2].id,
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      ],
      featured: true,
    },
    {
      name: 'The Art of Programming',
      slug: 'the-art-of-programming',
      description:
        'A comprehensive guide to modern software development practices and algorithms.',
      price: 49.99,
      stock: 150,
      categoryId: categories[3].id,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
      ],
      featured: false,
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description:
        'Non-slip, eco-friendly yoga mat with alignment lines. 6mm thickness for joint support.',
      price: 89.99,
      comparePrice: 119.99,
      stock: 75,
      categoryId: categories[4].id,
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      ],
      featured: true,
    },
  ]

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log(`Created ${products.length} products`)
  console.log('Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())

  