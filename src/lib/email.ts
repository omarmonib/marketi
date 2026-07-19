import { Resend } from 'resend'
import { OrderConfirmationEmail } from '@/emails/order-confirmation'

type OrderItem = {
  name: string
  quantity: number
  price: number
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  total,
  orderDate,
}: {
  to: string
  customerName: string
  orderId: string
  items: OrderItem[]
  total: number
  orderDate: string
}) {
  // Initialize inside the function so env var is available at runtime
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject: `Order Confirmed #${orderId.slice(-8).toUpperCase()} — Marketi`,
      react: OrderConfirmationEmail({
        customerName,
        orderId,
        items,
        total,
        orderDate,
      }),
    })
    console.log(`Order confirmation email sent to ${to}`)
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
  }
}
