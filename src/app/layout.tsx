import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/components/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Boa Me Youth Empowerment',
  description: 'Empowering Youth, Building Futures. Join us in creating opportunities for young people in Ghana.',
  keywords: 'NGO, youth empowerment, Ghana, education, community development',
  icons: {
    icon: [
      {
        url: '/favicon-16x16.svg',
        type: 'image/svg+xml',
        sizes: '16x16',
      },
      {
        url: '/favicon-32x32.svg',
        type: 'image/svg+xml',
        sizes: '32x32',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: '64x64',
      },
    ],
    shortcut: '/favicon.svg',
    apple: {
      url: '/favicon.svg',
      type: 'image/svg+xml',
    },
  },
  openGraph: {
    title: 'Boa Me Youth Empowerment',
    description: 'Empowering Youth, Building Futures. Join us in creating opportunities for young people in Ghana.',
    url: 'https://boame.org',
    siteName: 'Boa Me Youth Empowerment',
    images: [
      {
        url: '/asset.png',
        width: 400,
        height: 120,
        alt: 'Boa Me Youth Empowerment Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boa Me Youth Empowerment',
    description: 'Empowering Youth, Building Futures. Join us in creating opportunities for young people in Ghana.',
    images: ['/asset.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
