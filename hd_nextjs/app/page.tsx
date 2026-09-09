import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import About from './components/About'
import ProductCarousel from './components/ProductCarousel'
import AccountDashboard from './components/AccountDashboard'
import Material from './components/Material'
import Custom from './components/Custom'
import Contact from './components/Contact'
import Footer from './components/Footer'

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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <About />
        <ProductCarousel gender="men" category="jackets" />
        <ProductCarousel gender="men" category="coats" />
        <ProductCarousel gender="women" category="jackets" />
        <ProductCarousel gender="women" category="coats" />
        <AccountDashboard />

        <Material />
        <Custom />

        <Contact />
      </main>
      <Footer />
    </>
  )
}