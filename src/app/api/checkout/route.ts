import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    const productIds = items.map((item: { id: string }) => item.id)
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    })

    const lineItems = items.map((item: { id: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.id)
      if (!product) throw new Error(`Product ${item.id} not found`)

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: product.images.slice(0, 1),
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: item.quantity,
      }
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
