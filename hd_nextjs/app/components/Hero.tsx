export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-overlay"></div>

      <div className="hero-content">

        {/* LEFT SIDE */}
        <div className="hero-main">

          <div className="hero-subtitle">
            MANUFACTURER &amp; EXPORTER OF
            <br />
            LEATHER JACKET &amp; WOOL LONG COAT.
          </div>

          <h1 className="hero-craftsmanship">
            Premium Craftsmanship.
          </h1>

          <div className="hero-line"></div>

          <div className="hero-about">
            <h2>ABOUT US</h2>

            <p>
              Established in 2002, HIDE DESIGN has built a strong
              reputation for excellence in the manufacturing of
              premium leather goods, earning the trust of customers
              through exceptional craftsmanship, superior materials,
              and uncompromising quality.
            </p>

            <p>
              Today, HIDE DESIGN proudly extends its expertise to the
              manufacturing of luxury wool long coats, combining
              traditional tailoring techniques with contemporary
              designs to create garments that reflect sophistication
              and comfort.
            </p>
          </div>

          <div className="hero-actions">
            <a className="btn btn-gold" href="#men">
              EXPLORE COLLECTION <span>→</span>
            </a>

            <a className="btn btn-outline" href="#contact">
              CONTACT US
            </a>
          </div>

        </div>

      </div>

      {/* SCROLL */}
      <div className="hero-scroll">
        SCROLL TO EXPLORE
        <span className="chev"></span>
      </div>

    </section>
  )
}