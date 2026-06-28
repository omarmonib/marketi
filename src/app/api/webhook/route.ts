import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    if (!userId) {
      return NextResponse.json({ error: 'No userId' }, { status: 400 })
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    })

    try {
      const user = await db.user.findUnique({ where: { id: userId } })
      if (!user) throw new Error('User not found')

      let address = await db.address.findFirst({
        where: { userId, isDefault: true },
      })

      if (!address) {
        address = await db.address.create({
          data: {
            userId,
            fullName: user.name ?? 'Customer',
            phone: '',
            street: session.customer_details?.address?.line1 ?? 'N/A',
            city: session.customer_details?.address?.city ?? 'N/A',
            state: session.customer_details?.address?.state ?? 'N/A',
            postalCode: session.customer_details?.address?.postal_code ?? 'N/A',
            country: session.customer_details?.address?.country ?? 'N/A',
            isDefault: true,
          },
        })
      }

      const orderItems = lineItems.data.map((item) => {
        const stripeProduct =
          typeof item.price?.product === 'object'
            ? (item.price.product as Stripe.Product)
            : null

        const productId = stripeProduct?.metadata?.productId ?? ''

        return {
          productId,
          quantity: item.quantity ?? 1,
          price: (item.amount_total ?? 0) / 100 / (item.quantity ?? 1),
        }
      })

      const total = (session.amount_total ?? 0) / 100


      const validItems = orderItems.filter((item) => item.productId)

      await db.$transaction([
        db.order.create({
          data: {
            userId,
            addressId: address.id,
            total,
            subtotal: total,
            stripePaymentId: session.payment_intent as string,
            status: 'PROCESSING',
            paymentStatus: 'PAID',
            items: {
              create: validItems,
            },
          },
        }),
        ...validItems.map((item) =>
          db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
      ])

      console.log(`Order created for user ${userId}`)
    } catch (error) {
      console.error('Order creation error:', error)
      return NextResponse.json(
        { error: 'Order creation failed' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
