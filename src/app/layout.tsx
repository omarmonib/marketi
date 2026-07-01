import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Marketi — Shop Everything',
    template: '%s — Marketi',
  },
  description:
    'Discover thousands of products across every category — electronics, fashion, home, books, and more.',
  keywords: ['shop', 'ecommerce', 'electronics', 'fashion', 'home', 'books'],
  authors: [{ name: 'Marketi' }],
  creator: 'Marketi',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Marketi',
    title: 'Marketi — Shop Everything',
    description: 'Discover thousands of products across every category.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketi — Shop Everything',
    description: 'Discover thousands of products across every category.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
