export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <span className="eyebrow">ESTABLISHED 2002 · MADE FOR THE WORLD</span>
        <h1>Premium <em>Coats</em><br />&amp; Leather</h1>
        <p>Timeless silhouettes, superior craftsmanship and custom-made outerwear for brands, retailers and private clients.</p>
        <div className="hero-actions">
          <a className="btn btn-gold" href="#men">Explore Collection <span>→</span></a>
          <a className="btn btn-outline" href="#contact">Contact Us</a>
        </div>
      </div>
      <div className="hero-scroll">
        SCROLL TO EXPLORE <span className="chev"></span>
      </div>
    </section>
  )
}