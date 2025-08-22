import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Boa Me Youth Empowerment',
  description: 'Empowering Youth, Building Futures. Join us in creating opportunities for young people in Ghana.',
  keywords: 'NGO, youth empowerment, Ghana, education, community development',
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
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
