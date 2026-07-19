import * as React from 'react'

type OrderItem = {
  name: string
  quantity: number
  price: number
}

type Props = {
  customerName: string
  orderId: string
  items: OrderItem[]
  total: number
  orderDate: string
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  total,
  orderDate,
}: Props) {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontSize: '28px',
            margin: '0 0 8px 0',
            fontWeight: 'bold',
          }}
        >
          Marketi
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
          Order Confirmation
        </p>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', color: '#1e293b', margin: '0 0 8px 0' }}>
          Thank you, {customerName}! 🎉
        </h2>
        <p style={{ color: '#64748b', margin: 0, lineHeight: '1.6' }}>
          Your order has been confirmed and is being processed. We&apos;ll send you
          another email when your order ships.
        </p>
      </div>

      {/* Order Info */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span style={{ color: '#64748b', fontSize: '14px' }}>Order ID</span>
          <span
            style={{ color: '#1e293b', fontSize: '14px', fontWeight: 'bold' }}
          >
            #{orderId.slice(-8).toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b', fontSize: '14px' }}>Order Date</span>
          <span style={{ color: '#1e293b', fontSize: '14px' }}>
            {orderDate}
          </span>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{ fontSize: '16px', color: '#1e293b', margin: '0 0 12px 0' }}
        >
          Order Items
        </h3>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                borderBottom:
                  i < items.length - 1 ? '1px solid #e2e8f0' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 2px 0',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1e293b',
                  }}
                >
                  {item.name}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                }}
              >
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div
        style={{
          background: '#f8fafc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}
          >
            Total
          </span>
          <span
            style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#64748b' }}>Shipping</span>
          <span style={{ fontSize: '13px', color: '#16a34a' }}>Free</span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL}/orders`}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          View Your Orders
        </a>
      </div>

      {/* Trust signals */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '24px',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px',
        }}
      >
        {[
          { icon: '🚚', text: 'Free Shipping' },
          { icon: '↩️', text: '30-Day Returns' },
          { icon: '🔒', text: 'Secure Payment' },
        ].map((item) => (
          <div key={item.text} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>
              {item.icon}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {item.text}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '16px',
        }}
      >
        <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px 0' }}>
          © {new Date().getFullYear()} Marketi. All rights reserved.
        </p>
        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
          If you have any questions, reply to this email or contact our support
          team.
        </p>
      </div>
    </div>
  )
}
