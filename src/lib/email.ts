// Email abstraction — swap SMTP providers without touching business logic
// Dev: logs to console (no config needed)
// Prod: uses nodemailer with any SMTP provider (Gmail, SendGrid, your own server)

import { render } from '@react-email/render'
import { OrderConfirmationEmail } from '@/emails/order-confirmation'

type OrderItem = {
  name: string
  quantity: number
  price: number
}

type SendEmailParams = {
  to: string
  customerName: string
  orderId: string
  items: OrderItem[]
  total: number
  orderDate: string
}

async function sendViaNodemailer(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const nodemailer = await import('nodemailer')

  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'noreply@marketi.com',
    to,
    subject,
    html,
  })
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  total,
  orderDate,
}: SendEmailParams): Promise<void> {
  const subject = `Order Confirmed #${orderId.slice(-8).toUpperCase()} — Marketi`

  try {
    const html = await render(
      OrderConfirmationEmail({
        customerName,
        orderId,
        items,
        total,
        orderDate,
      })
    )

    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER

    if (hasSmtp) {
      await sendViaNodemailer(to, subject, html)
      console.log(`Order confirmation email sent to ${to}`)
    } else {
      // Dev fallback — log to console instead of crashing
      console.log(`[EMAIL] To: ${to}`)
      console.log(`[EMAIL] Subject: ${subject}`)
      console.log(`[EMAIL] No SMTP configured — email not sent`)
    }
  } catch (error) {
    // Never crash the order flow because of email failure
    console.error('Failed to send order confirmation email:', error)
  }
}
