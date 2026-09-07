import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost, League_Script } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'block',
})

const leagueScript = League_Script({
  variable: '--font-league-script',
  subsets: ['latin'],
  weight: '400',
  display: 'block',
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

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HIDE DESIGN',
  alternateName: ['Hide Design', 'hidesdesign.com'],
  url: 'https://www.hidesdesign.com/',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${leagueScript.variable} ${jost.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />

        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  )
}