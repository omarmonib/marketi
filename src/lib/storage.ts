// Storage abstraction — swap implementations without touching business logic
// Local: saves to /public/uploads (served by Next.js)
// Production: swap to Vercel Blob or any other provider here

export type StorageResult = {
  url: string
}

async function saveLocal(
  buffer: Buffer,
  filename: string
): Promise<StorageResult> {
  const { writeFile, mkdir } = await import('fs/promises')
  const { join } = await import('path')

  const uploadDir = join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath = join(uploadDir, safeName)
  await writeFile(filePath, buffer)

  return { url: `/uploads/${safeName}` }
}

async function saveBlob(
  buffer: Buffer,
  filename: string
): Promise<StorageResult> {
  const { put } = await import('@vercel/blob')
  const safeName = `products/${Date.now()}-${filename}`
  const blob = await put(safeName, buffer, { access: 'public' })
  return { url: blob.url }
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
): Promise<StorageResult> {
  const isProduction = process.env.NODE_ENV === 'production'
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN

  if (isProduction && hasBlobToken) {
    return saveBlob(buffer, filename)
  }

  return saveLocal(buffer, filename)
}
