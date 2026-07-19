import { NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function GET() {
  await sendOrderConfirmationEmail({
    to: 'omar.monib.03@gmail.com',
    customerName: 'Omar',
    orderId: 'test-order-123',
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: 299.99 },
      { name: 'Smart LED Lamp', quantity: 2, price: 59.99 },
    ],
    total: 419.97,
    orderDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  })

  return NextResponse.json({ success: true })
}
