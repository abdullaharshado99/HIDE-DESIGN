export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-overlay"></div>

      <div className="hero-content">

        <div className="hero-brand">
          <div className="hero-logo">HD</div>

          <h2>HIDE DESIGN</h2>

          <span>
            MANUFACTURER &amp; EXPORTER OF LEATHER
            <br />
            JACKET &amp; LONG COAT.
          </span>
        </div>

        <div className="hero-title">
          <span>PREMIUM QUALITY</span>

          <h1>COATS</h1>
        </div>

        <div className="hero-description">
          <div className="hero-features">
            <span>Timeless Style</span>
            <b>•</b>
            <span>Superior Craftsmanship</span>
            <b>•</b>
            <span>Custom Made</span>
          </div>

          <p>
            Established in 2002, we deal in leather jackets
            and goods. Now offering premium quality wool
            (tweed) long coat in custom design and
            alignments.
          </p>
        </div>

        <div className="hero-actions">
          <a className="btn btn-gold" href="#men">
            Explore Cotes <span>→</span>
          </a>

          <a className="btn btn-outline" href="#contact">
            Contact Us
          </a>
        </div>

      </div>

      <div className="hero-scroll">
        SCROLL TO EXPLORE
        <span className="chev"></span>
      </div>
    </section>
  )
}