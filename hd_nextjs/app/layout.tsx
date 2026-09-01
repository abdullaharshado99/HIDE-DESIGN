import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hidesdesign.com'),
  title: 'HIDE DESIGN | Premium Coats & Leather',
  description: 'Manufacturer & Exporter of Leather Jackets and Long Coats.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HIDE DESIGN | Premium Coats & Leather',
    description: 'Manufacturer & Exporter of Leather Jackets and Long Coats.',
    url: 'https://hidesdesign.com/',
    siteName: 'HIDE DESIGN',
    type: 'website',
    images: [
      {
        url: 'https://hidesdesign.com/file.svg',
        width: 1200,
        height: 630,
        alt: 'HIDE DESIGN',
      },
    ],
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jost.variable}`}>
        {children}
      </body>
    </html>
  )
}