import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  comparePrice: z
    .union([z.coerce.number().positive(), z.literal('')])
    .optional(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})

export type ProductInput = z.infer<typeof ProductSchema>
