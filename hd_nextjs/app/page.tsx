import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import ProductCarousel from './components/ProductCarousel'
import AccountDashboard from './components/AccountDashboard'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <ProductCarousel gender="men" />
        <ProductCarousel gender="women" />
        <AccountDashboard />

        <section className="material-section" id="leather">
          <div className="container material-grid">
            <div className="material-copy">
              <span className="eyebrow">OUR MATERIALS</span>
              <h2>From fine <em>leather</em><br />to premium wool.</h2>
              <p>We work with carefully selected hides, wool, tweed and premium blends to create outerwear that feels exceptional and holds its character season after season.</p>
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
            <div className="material-panel">
              <div className="material-panel-inner">
                <span>H</span>
                <p>CRAFTED<br />WITH<br />PURPOSE</p>
                <small>HIDE DESIGN · SINCE 2002</small>
              </div>
            </div>
          </div>
        </section>

        <section className="custom-section" id="custom">
          <div className="container custom-inner">
            <span className="eyebrow">PRIVATE LABEL · WHOLESALE · BESPOKE</span>
            <h2>Your design.<br /><em>Our craftsmanship.</em></h2>
            <p>Share your sketches, references, fabric requirements or size specifications. Our team can develop custom coats for your collection or private label.</p>
            <a className="btn btn-gold" href="#contact">Start A Custom Project <span>→</span></a>
          </div>
        </section>

        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
} 