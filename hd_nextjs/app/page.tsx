import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import About from './components/About'
import ProductCarousel from './components/ProductCarousel'
import AccountDashboard from './components/AccountDashboard'
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

<section className="material-section" id="leather">
  <div className="material-grid">

    {/* LEFT — MATERIALS + SERVICES */}
    <div className="material-left">

      {/* OUR MATERIALS */}
      <div className="material-copy">
        <span className="eyebrow">OUR MATERIALS</span>

        <h2>
          From fine <em>leather</em>
          <br />
          to premium wool.
        </h2>

        <p>
          We work with carefully selected hides, wool, tweed and premium
          blends to create outerwear that feels exceptional and holds its
          character season after season.
        </p>

        <div className="material-list">
          <div>
            <span>01</span>
            <b>Leather</b>
            <small>Jackets · Coats · Custom Finishes</small>
          </div>

          <div>
            <span>02</span>
            <b>Wool &amp; Tweed</b>
            <small>Long Coats · Overcoats · Tailoring</small>
          </div>

          <div>
            <span>03</span>
            <b>Custom Fabrics</b>
            <small>Developed To Your Specification</small>
          </div>
        </div>
      </div>


      {/* OUR SERVICES */}
      <div className="services-copy">
        <span className="eyebrow">OUR SERVICES</span>

        <h2>
          Built for <em>business.</em>
        </h2>

        <div className="services-list">
          <div>
            <span>01</span>
            <b>Retail</b>
          </div>

          <div>
            <span>02</span>
            <b>Wholesale</b>
          </div>

          <div>
            <span>03</span>
            <b>Exporter</b>
          </div>

          <div>
            <span>04</span>
            <b>Manufacturing Departmentsip</b>
          </div>
        </div>
      </div>

    </div>


    {/* RIGHT — ONE IMAGE ONLY */}
    <div className="material-panel">
      <img
        src="/images/materials.jpg"
        alt="Premium leather and wool materials"
      />
    </div>

  </div>
</section>
<section className="custom-section" id="custom">
  <div className="custom-inner">

    {/* LEFT — IMAGE */}
    <div className="custom-image">
      <img
        src="/images/custom-project.jpg"
        alt="Custom leather craftsmanship"
      />
    </div>

    {/* RIGHT — TEXT */}
    <div className="custom-copy">
      <span className="eyebrow">
        PRIVATE LABEL · WHOLESALE · BESPOKE
      </span>

      <h2>
        Your design.
        <br />
        <em>Our craftsmanship.</em>
      </h2>

      <p>
        Share your sketches, references, fabric requirements or size
        specifications. Our team can develop custom coats for your
        collection or private label.
      </p>

      <a className="btn btn-gold" href="#contact">
        Start A Custom Project <span>→</span>
      </a>
    </div>

  </div>
</section>
        <Contact />
      </main>
      <Footer />
    </>
  )
} 